import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthenticatedUserClaims } from './types/authenticated-user-claims';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  getHealth() {
    return this.authService.getStatus();
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() claims: AuthenticatedUserClaims) {
    return this.authService.getCurrentUser(claims.sub);
  }
}
