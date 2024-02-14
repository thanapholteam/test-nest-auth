import { OtpService } from 'src/otp/otp.service';
import { SessionService } from 'src/session/session.service';
import { AuthService } from './../auth/auth.service';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  UserForgotStep,
  UserLoginDTO,
  UserRegisterDTO,
  UserRepasswordStep,
  UserVerifyStep,
} from './dto/user.dto';
import { EmailService } from 'src/email/email.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request, @Res() res: Response) {
    const user = await this.userService.findUserByID(req['userId']);
    return res.json({
      message: 'success',
      data: {
        email: user.email,
        name: user.name,
      },
    }).send;
  }

  @Post('/login')
  async loginUser(@Body() data: UserLoginDTO, @Res() res: Response) {
    if (!data.email || !data.password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid body' })
        .send();
    }
    const user = await this.userService.findUserByEmail(data.email);

    if (user.password !== data.password) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          message: "Can't Login",
        })
        .send();
    }

    const session = await this.authService.signSession(user.id);
    res.cookie('ssid', session.ssid);
    return res
      .status(HttpStatus.OK)
      .json({
        message: 'success',
      })
      .send();
  }

  @Post('/register')
  async createUser(
    @Body() userRegisterDTO: UserRegisterDTO,
    @Res() res: Response,
  ) {
    if (!userRegisterDTO.email || !userRegisterDTO.password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid body' })
        .send();
    }
    const user = await this.userService.createUser(userRegisterDTO);

    if (user === null) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message: 'Email already use',
        })
        .send();
    }

    return res
      .status(HttpStatus.CREATED)
      .json({
        message: 'success',
      })
      .send();
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.sessionService.deleteSession(req['ssid']);
    res.clearCookie('ssid');
    res.json({ message: 'success' }).status(HttpStatus.OK);
    return res.end();
  }

  @Post('/forgot')
  async forgetPassword(
    @Req() req: Request,
    @Body() data: UserForgotStep,
    @Res() res: Response,
  ) {
    if (!data.email) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'An email is required' })
        .send();
    }
    const user = await this.userService.findUserByEmail(data.email);
    if (user === null || user === undefined) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "can't find user" })
        .send();
    }

    const opt = await this.otpService.findOTPByUserID(user.id);

    if (opt.length !== 0) {
      for (let i = 0; i < opt.length; i++) {
        await this.otpService.deleteOTP(opt[i].id);
      }
    }

    const otpId = await this.otpService.createOTP(user.id);
    // TODO: Send Email
    // send email with emailService (Send OTP to user email)
    await this.emailService.sendEmail(
      user.email,
      'Forgot Password',
      `Your OTP is ${otpId.code}`,
    );
    return res.json({ message: 'success', url: otpId.id }).send();
  }

  @Post('/verify/otp')
  async verifyOtp(
    @Req() req: Request,
    @Body() data: UserVerifyStep,
    @Res() res: Response,
  ) {
    if (!data.id || !data.email || !data.code) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid Body' })
        .send();
    }
    const OTP = await this.otpService.findOTP(data.id);
    const user = await this.userService.findUserByEmail(data.email);
    if (!OTP || !user) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Invalid OTP' })
        .send();
    }

    if (OTP.code !== data.code || OTP.userId !== user.id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Invalid Body' })
        .send();
    }

    return res.json({ message: 'success', url: OTP.id }).send();
  }

  @Post('/reset-password')
  async rePassword(
    @Req() req: Request,
    @Body() data: UserRepasswordStep,
    @Res() res: Response,
  ) {
    if (!data.id || !data.email || !data.newPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid Body' })
        .send();
    }
    const OTP = await this.otpService.findOTP(data.id);
    const user = await this.userService.findUserByEmail(data.email);
    if (!OTP || !user) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Invalid OTP' })
        .send();
    }

    if (OTP.userId !== user.id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Invalid Body' })
        .send();
    }

    await this.userService.UpdatePasswordByEmail(data.email, data.newPassword);
    await this.otpService.deleteOTP(data.id);
    return res.json({ message: 'success' }).send();
  }
}
