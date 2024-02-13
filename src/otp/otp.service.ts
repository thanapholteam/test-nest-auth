import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOTP(userId: string) {
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiredAt = new Date();
    const time = expiredAt.getTime();
    const expireTime = time + 1000 * 3600; // 1 hour
    expiredAt.setTime(expireTime);
    return this.prismaService.oneTimePass.create({
      data: {
        code: code.toString(),
        userId: userId,
        expiredAt: expiredAt,
      },
    });
  }

  async findOTP(id: string) {
    return this.prismaService.oneTimePass.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOTPByUserID(userId: string) {
    return this.prismaService.oneTimePass.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async deleteOTP(id: string) {
    return this.prismaService.oneTimePass.delete({
      where: {
        id: id,
      },
    });
  }
}
