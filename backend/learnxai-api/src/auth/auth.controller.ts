import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

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
}
