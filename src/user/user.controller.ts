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
import { UserForgotDTO, UserLoginDTO, UserRegisterDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
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
    await this.userService.createUser(userRegisterDTO);

    return res
      .status(HttpStatus.CREATED)
      .json({
        message: 'success',
      })
      .send();
  }

  @Post('/forgot')
  async forgetPassword(
    @Req() req: Request,
    @Body() data: UserForgotDTO,
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

    // TODO: Send Email
    return res.json({ message: 'success' }).send();
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.sessionService.deleteSession(req['ssid']);
    res.clearCookie('ssid');
    res.json({ message: 'success' }).status(HttpStatus.OK);
    return res.end();
  }
}
