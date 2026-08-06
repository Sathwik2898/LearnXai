import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JWT_ACCESS_CONFIG } from './../src/config/env';
import type { JwtAccessConfig } from './../src/config/env';
import { PrismaService } from './../src/prisma/prisma.service';

type TestUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'LEARNER';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TestUserWhere = {
  id?: string;
  email?: string;
};

type TestUserCreateData = {
  name: string;
  email: string;
  passwordHash: string;
};

type SafeUserBody = {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
};

type LoginBody = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: SafeUserBody;
};

describe('LearnXai API (e2e)', () => {
  const jwtConfig: JwtAccessConfig = {
    secret: 'e2e-test-only-secret-with-at-least-32-characters',
    expiresInSeconds: 300,
    issuer: 'learnxai-api-e2e',
    audience: 'learnxai-client-e2e',
  };
  const usersById = new Map<string, TestUser>();
  let nextUserId = 1;
  const prisma = {
    user: {
      findUnique: jest.fn(
        ({ where }: { where: TestUserWhere }): TestUser | null => {
          if (where.id) {
            return usersById.get(where.id) ?? null;
          }

          if (where.email) {
            return (
              [...usersById.values()].find(
                (user) => user.email === where.email,
              ) ?? null
            );
          }

          return null;
        },
      ),
      create: jest.fn(({ data }: { data: TestUserCreateData }): TestUser => {
        const duplicate = [...usersById.values()].some(
          (user) => user.email === data.email,
        );

        if (duplicate) {
          throw Object.assign(new Error('Unique constraint failed.'), {
            code: 'P2002',
          });
        }

        const now = new Date();
        const user: TestUser = {
          id: `00000000-0000-4000-8000-${String(nextUserId).padStart(12, '0')}`,
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          role: 'LEARNER',
          isEmailVerified: false,
          createdAt: now,
          updatedAt: now,
        };

        nextUserId += 1;
        usersById.set(user.id, user);
        return user;
      }),
    },
  };

  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(JWT_ACCESS_CONFIG)
      .useValue(jwtConfig)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    usersById.clear();
    nextUserId = 1;
    jest.clearAllMocks();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/health (GET)', () => {
    return request(app.getHttpServer()).get('/auth/health').expect(200).expect({
      module: 'auth',
      status: 'ready',
      usersLayer: 'connected',
    });
  });

  it('registers, logs in, and returns the authenticated current user', async () => {
    const registrationResponse = await registerLearner();
    const registrationBody = parseResponseBody(
      registrationResponse,
    ) as SafeUserBody;

    expect(registrationResponse.status).toBe(201);
    expectSafeResponse(registrationBody);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: '  LEARNER@EXAMPLE.COM  ',
        password: 'SecurePassword123',
      })
      .expect(200);
    const loginBody = parseResponseBody(loginResponse) as LoginBody;

    expect(typeof loginBody.accessToken).toBe('string');
    expect(loginBody.tokenType).toBe('Bearer');
    expect(loginBody.expiresIn).toBe(jwtConfig.expiresInSeconds);
    expect(loginBody.user).toEqual(registrationBody);
    expectSafeResponse(loginBody);

    const currentUserResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(200);
    const currentUserBody = parseResponseBody(
      currentUserResponse,
    ) as SafeUserBody;

    expect(currentUserBody).toEqual(registrationBody);
    expectSafeResponse(currentUserBody);
  });

  it('returns 401 for an incorrect password without revealing account state', async () => {
    await registerLearner();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'learner@example.com',
        password: 'IncorrectPassword123',
      })
      .expect(401);
    const responseBody = parseResponseBody(response) as { message: string };

    expect(responseBody.message).toBe('Invalid email or password.');
  });

  it('returns the same 401 response for an unknown email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'unknown@example.com',
        password: 'SecurePassword123',
      })
      .expect(401);
    const responseBody = parseResponseBody(response) as { message: string };

    expect(responseBody.message).toBe('Invalid email or password.');
  });

  it('returns 400 for invalid login input', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'not-an-email', password: '' })
      .expect(400);
  });

  it('returns 401 when /auth/me has no access token', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('returns 401 when /auth/me has a malformed access token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer not-a-valid-jwt')
      .expect(401);
  });

  it('returns 401 when /auth/me has a token with an invalid signature', () => {
    const token = sign(
      {
        sub: '00000000-0000-4000-8000-000000000001',
        email: 'learner@example.com',
        role: 'LEARNER',
      },
      'different-e2e-secret-with-at-least-32-characters',
      {
        algorithm: 'HS256',
        expiresIn: jwtConfig.expiresInSeconds,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      },
    );

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('returns 401 when /auth/me has an expired access token', () => {
    const token = issueTestToken('00000000-0000-4000-8000-000000000001', -1);

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('returns 401 when the token subject no longer exists', () => {
    const token = issueTestToken(
      '00000000-0000-4000-8000-000000999999',
      jwtConfig.expiresInSeconds,
    );

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  afterAll(async () => {
    usersById.clear();
    await app.close();
  });

  function registerLearner() {
    return request(app.getHttpServer()).post('/auth/register').send({
      name: 'Demo Learner',
      email: 'learner@example.com',
      password: 'SecurePassword123',
    });
  }

  function issueTestToken(subject: string, expiresIn: number) {
    return sign(
      {
        sub: subject,
        email: 'learner@example.com',
        role: 'LEARNER',
      },
      jwtConfig.secret,
      {
        algorithm: 'HS256',
        expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      },
    );
  }

  function expectSafeResponse(response: unknown) {
    const serializedResponse = JSON.stringify(response);

    expect(serializedResponse).not.toMatch(/password/i);
  }

  function parseResponseBody(response: { text: string }): unknown {
    return JSON.parse(response.text) as unknown;
  }
});
