import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(email: string, name: string) {
    return this.prismaService.user.create({
      data: {
        email: email,
        name: name,
      },
    });
  }
}
