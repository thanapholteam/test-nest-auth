import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(userId: string) {
    const id = randomUUID();
    const expiredAt = new Date();
    const time = expiredAt.getTime();
    const expireTime = time + 1000 * 3600 * 24 * 7; // 7 days
    expiredAt.setTime(expireTime);
    return this.prismaService.session.create({
      data: {
        id: id,
        userId: userId,
        expiredAt: expiredAt,
      },
    });
  }

  async findSession(sessionId: string) {
    return this.prismaService.session.findUnique({
      where: {
        id: sessionId,
      },
    });
  }

  async deleteSession(sessionId: string) {
    return this.prismaService.session.delete({
      where: {
        id: sessionId,
      },
    });
  }
}
