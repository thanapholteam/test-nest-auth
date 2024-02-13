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
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

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
    res.json({ message: 'success' }).send;
  }

  @Post('/login')
  async loginUser(@Body() data: Prisma.UserCreateInput, @Res() res: Response) {
    const user = await this.userService.findUser(data.email);

    if (user.password !== data.password) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          message: 'login fail',
        })
        .send();
    }

    const session = await this.authService.signSession(user.id);
    res.cookie('ssid', session.ssid);
    res
      .status(HttpStatus.OK)
      .json({
        message: 'success',
      })
      .send();
  }

  @Post('/register')
  async createUser(
    @Body() createUserDto: Prisma.UserCreateInput,
    @Res() res: Response,
  ) {
    await this.userService.createUser(createUserDto);

    res
      .status(HttpStatus.CREATED)
      .json({
        message: 'success',
      })
      .send();
  }

  @Post('/forget')
  async forgetPassword() {}

  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.sessionService.deleteSession(req['ssid']);
    res.clearCookie('ssid');
    res.json({ message: 'success' }).status(HttpStatus.OK);
    res.end();
  }
}
