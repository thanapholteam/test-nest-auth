import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.createUser(createUserDto.email, createUserDto.name);
  }
}
