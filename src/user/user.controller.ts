import { UserService } from './user.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  createUser(
    @Body() createUserDto: Prisma.UserCreateInput,
    @Res() res: Response,
  ) {
    this.userService.createUser(createUserDto.email, createUserDto.name);
    res.status(HttpStatus.CREATED).send();
  }

  @Post('/forget')
  forgetPassword() {}
}
