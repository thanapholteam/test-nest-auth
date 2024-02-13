import { User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(email: string, name: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: email,
        name: name,
      },
    });
  }
}
