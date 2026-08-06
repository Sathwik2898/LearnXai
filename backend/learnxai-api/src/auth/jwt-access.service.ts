import { Inject, Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JWT_ACCESS_CONFIG } from '../config/env';
import type { JwtAccessConfig } from '../config/env';
import { isAuthenticatedUserRole } from './types/authenticated-user-claims';
import type { AuthenticatedUserClaims } from './types/authenticated-user-claims';

@Injectable()
export class JwtAccessService {
  constructor(
    @Inject(JWT_ACCESS_CONFIG)
    private readonly config: JwtAccessConfig,
  ) {}

  get expiresInSeconds() {
    return this.config.expiresInSeconds;
  }

  issueToken(claims: AuthenticatedUserClaims) {
    return sign(claims, this.config.secret, {
      algorithm: 'HS256',
      expiresIn: this.config.expiresInSeconds,
      issuer: this.config.issuer,
      audience: this.config.audience,
    });
  }

  verifyToken(token: string): AuthenticatedUserClaims {
    const payload = verify(token, this.config.secret, {
      algorithms: ['HS256'],
      issuer: this.config.issuer,
      audience: this.config.audience,
    });

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      !isAuthenticatedUserRole(payload.role)
    ) {
      throw new Error('Invalid access token claims.');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
