import { decode, sign } from 'jsonwebtoken';
import { loadJwtAccessConfig } from '../config/env';
import type { JwtAccessConfig } from '../config/env';
import { JwtAccessService } from './jwt-access.service';

describe('JwtAccessService', () => {
  const config: JwtAccessConfig = {
    secret: 'unit-test-only-secret-with-at-least-32-characters',
    expiresInSeconds: 900,
    issuer: 'learnxai-api-test',
    audience: 'learnxai-client-test',
  };
  const claims = {
    sub: '83ad7f47-633c-4714-896d-d87efa35acbd',
    email: 'learner@example.com',
    role: 'LEARNER' as const,
  };
  const service = new JwtAccessService(config);

  it('issues and verifies a short-lived token with only safe custom claims', () => {
    const token = service.issueToken(claims);
    const decoded = decode(token);

    expect(decoded).toMatchObject({
      ...claims,
      iss: config.issuer,
      aud: config.audience,
    });
    expect(decoded).not.toHaveProperty('name');
    expect(decoded).not.toHaveProperty('password');
    expect(decoded).not.toHaveProperty('passwordHash');
    expect(service.verifyToken(token)).toEqual(claims);
    expect(service.expiresInSeconds).toBe(900);
  });

  it('rejects an expired token', () => {
    const expiredToken = sign(claims, config.secret, {
      algorithm: 'HS256',
      expiresIn: -1,
      issuer: config.issuer,
      audience: config.audience,
    });

    expect(() => service.verifyToken(expiredToken)).toThrow();
  });

  it('requires explicit secure JWT environment configuration', () => {
    expect(() => loadJwtAccessConfig({})).toThrow(
      'JWT_ACCESS_SECRET must be set.',
    );
  });
});
