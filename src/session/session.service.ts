import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}
  async createSession(userId: string) {
    const id = randomUUID();
    return this.prismaService.session.create({
      data: {
        id: id,
        userId: userId,
      },
    });
  }
}
