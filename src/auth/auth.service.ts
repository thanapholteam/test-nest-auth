import { SessionService } from 'src/session/session.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private jwtService: JwtService,
  ) {}

  async signSession(userId: string): Promise<{ ssid: string }> {
    const sessionId = await this.sessionService.createSession(userId);
    const payload = { data: sessionId.id };

    return {
      ssid: await this.jwtService.signAsync(payload),
    };
  }
}
