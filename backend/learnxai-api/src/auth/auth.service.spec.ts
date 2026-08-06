import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAccessService } from './jwt-access.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const createdAt = new Date('2026-08-06T12:00:00.000Z');
  const learner = {
    id: '83ad7f47-633c-4714-896d-d87efa35acbd',
    name: 'Demo Learner',
    email: 'learner@example.com',
    passwordHash: 'bcrypt-password-hash',
    role: 'LEARNER' as const,
    isEmailVerified: false,
    createdAt,
    updatedAt: createdAt,
  };
  const usersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createLearner: jest.fn(),
  };
  const jwtAccessService = {
    issueToken: jest.fn(),
    expiresInSeconds: 900,
  };

  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtAccessService as unknown as JwtAccessService,
    );
    (hash as jest.Mock).mockResolvedValue('bcrypt-password-hash');
    (compare as jest.Mock).mockResolvedValue(true);
    jwtAccessService.issueToken.mockReturnValue('signed-access-token');
  });

  describe('registration', () => {
    it('registers a learner with a normalized email and a hashed password', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.createLearner.mockResolvedValue(learner);

      const result = await authService.register({
        name: '  Demo Learner  ',
        email: '  Learner@Example.COM  ',
        password: 'secure-password',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'learner@example.com',
      );
      expect(hash).toHaveBeenCalledWith('secure-password', 12);
      expect(usersService.createLearner).toHaveBeenCalledWith({
        name: 'Demo Learner',
        email: 'learner@example.com',
        passwordHash: 'bcrypt-password-hash',
      });
      expect(result).toEqual({
        id: learner.id,
        name: learner.name,
        email: learner.email,
        role: learner.role,
        isEmailVerified: learner.isEmailVerified,
        createdAt,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('rejects an existing normalized email with a conflict', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'existing-user' });

      await expect(
        authService.register({
          name: 'Demo Learner',
          email: '  LEARNER@example.com ',
          password: 'secure-password',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'learner@example.com',
      );
      expect(hash).not.toHaveBeenCalled();
      expect(usersService.createLearner).not.toHaveBeenCalled();
    });

    it.each([
      [
        'missing name',
        { name: '', email: 'learner@example.com', password: 'secure-password' },
      ],
      [
        'invalid email',
        {
          name: 'Demo Learner',
          email: 'not-an-email',
          password: 'secure-password',
        },
      ],
      [
        'short password',
        {
          name: 'Demo Learner',
          email: 'learner@example.com',
          password: 'short',
        },
      ],
      [
        'password exceeding the bcrypt byte limit',
        {
          name: 'Demo Learner',
          email: 'learner@example.com',
          password: 'a'.repeat(73),
        },
      ],
    ])('rejects invalid input: %s', async (_caseName, input) => {
      await expect(authService.register(input)).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(usersService.findByEmail).not.toHaveBeenCalled();
      expect(hash).not.toHaveBeenCalled();
      expect(usersService.createLearner).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns an access token and a safe user for valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(learner);

      const result = await authService.login({
        email: learner.email,
        password: 'secure-password',
      });

      expect(compare).toHaveBeenCalledWith(
        'secure-password',
        learner.passwordHash,
      );
      expect(jwtAccessService.issueToken).toHaveBeenCalledWith({
        sub: learner.id,
        email: learner.email,
        role: learner.role,
      });
      expect(result).toEqual({
        accessToken: 'signed-access-token',
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          id: learner.id,
          name: learner.name,
          email: learner.email,
          role: learner.role,
          isEmailVerified: false,
          createdAt,
        },
      });
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('password');
    });

    it('trims and lowercases the email before lookup', async () => {
      usersService.findByEmail.mockResolvedValue(learner);

      await authService.login({
        email: '  Learner@Example.COM  ',
        password: 'secure-password',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'learner@example.com',
      );
    });

    it('returns the generic unauthorized response for an unknown email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'unknown@example.com',
          password: 'secure-password',
        }),
      ).rejects.toMatchObject({
        response: {
          message: 'Invalid email or password.',
        },
        status: 401,
      });

      expect(compare).not.toHaveBeenCalled();
      expect(jwtAccessService.issueToken).not.toHaveBeenCalled();
    });

    it('returns the same generic unauthorized response for a wrong password', async () => {
      usersService.findByEmail.mockResolvedValue(learner);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: learner.email,
          password: 'incorrect-password',
        }),
      ).rejects.toMatchObject({
        response: {
          message: 'Invalid email or password.',
        },
        status: 401,
      });

      expect(jwtAccessService.issueToken).not.toHaveBeenCalled();
    });

    it.each([
      ['invalid email', { email: 'not-an-email', password: 'secure-password' }],
      ['missing password', { email: learner.email, password: '' }],
      [
        'password exceeding the bcrypt byte limit',
        { email: learner.email, password: 'a'.repeat(73) },
      ],
    ])('rejects invalid login input: %s', async (_caseName, input) => {
      await expect(authService.login(input)).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(usersService.findByEmail).not.toHaveBeenCalled();
      expect(compare).not.toHaveBeenCalled();
    });
  });

  describe('current user', () => {
    it('returns a safe current-user response', async () => {
      usersService.findById.mockResolvedValue(learner);

      const result = await authService.getCurrentUser(learner.id);

      expect(result).toEqual({
        id: learner.id,
        name: learner.name,
        email: learner.email,
        role: learner.role,
        isEmailVerified: false,
        createdAt,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('rejects a token subject whose user no longer exists', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(
        authService.getCurrentUser('deleted-user-id'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
