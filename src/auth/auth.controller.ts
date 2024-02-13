import { AuthService } from './auth.service';
import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  getAuth(): string {
    return this.appService.myTest();
  }
}
