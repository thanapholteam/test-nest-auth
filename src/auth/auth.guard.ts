import { SessionService } from './../session/session.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      req['ssid'] = payload?.data;
      const userId = (await this.sessionService.findSession(payload?.data))
        .userId;
      if (userId === null || userId === undefined) {
        throw new UnauthorizedException();
      }
      req['userId'] = userId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(@Req() req): string | undefined {
    const ssid = req.cookies?.['ssid'];
    return ssid;
  }
}
