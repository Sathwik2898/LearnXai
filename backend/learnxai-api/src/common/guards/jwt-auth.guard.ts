import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAccessService } from '../../auth/jwt-access.service';
import type { AuthenticatedUserClaims } from '../../auth/types/authenticated-user-claims';

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUserClaims;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtAccessService: JwtAccessService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.getBearerToken(request.headers.authorization);

    try {
      request.user = this.jwtAccessService.verifyToken(token);
      return true;
    } catch {
      throw new UnauthorizedException('Authentication required.');
    }
  }

  private getBearerToken(authorization: string | undefined) {
    if (!authorization) {
      throw new UnauthorizedException('Authentication required.');
    }

    const [scheme, token, ...unexpectedParts] = authorization
      .trim()
      .split(/\s+/);

    if (
      scheme?.toLowerCase() !== 'bearer' ||
      !token ||
      unexpectedParts.length > 0
    ) {
      throw new UnauthorizedException('Authentication required.');
    }

    return token;
  }
}
