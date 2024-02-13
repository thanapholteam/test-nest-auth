import { User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserRegisterDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: UserRegisterDTO): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: user.password,
        },
      });
    } catch (error) {
      return null;
    }
  }

  async UpdatePasswordByEmail(
    email: string,
    newPassword: string,
  ): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async findUserByID(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
