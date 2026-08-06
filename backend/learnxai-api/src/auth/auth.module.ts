import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JWT_ACCESS_CONFIG, loadJwtAccessConfig } from '../config/env';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessService } from './jwt-access.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: JWT_ACCESS_CONFIG,
      useFactory: loadJwtAccessConfig,
    },
    AuthService,
    JwtAccessService,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
