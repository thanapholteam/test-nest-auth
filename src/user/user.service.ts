import { Prisma, User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
  }

  async findUser(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
