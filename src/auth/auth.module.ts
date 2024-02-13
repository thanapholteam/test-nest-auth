import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AppService],
})
export class AuthModule {}
