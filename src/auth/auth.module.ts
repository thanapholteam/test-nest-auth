import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionService } from 'src/session/session.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService, SessionService, UserService],
})
export class AuthModule {}
