import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { SessionService } from 'src/session/session.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    PrismaService,
    SessionService,
    OtpService,
    EmailService,
  ],
})
export class UserModule {}
