import { BadRequestException, ConflictException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('AuthService registration', () => {
  const usersService = {
    findByEmail: jest.fn(),
    createLearner: jest.fn(),
  };

  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(usersService as unknown as UsersService);
    (hash as jest.Mock).mockResolvedValue('bcrypt-password-hash');
  });

  it('registers a learner with a normalized email and a hashed password', async () => {
    const createdAt = new Date('2026-08-06T12:00:00.000Z');

    usersService.findByEmail.mockResolvedValue(null);
    usersService.createLearner.mockResolvedValue({
      id: '83ad7f47-633c-4714-896d-d87efa35acbd',
      name: 'Demo Learner',
      email: 'learner@example.com',
      passwordHash: 'bcrypt-password-hash',
      role: 'LEARNER',
      isEmailVerified: false,
      createdAt,
      updatedAt: createdAt,
    });

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
      id: '83ad7f47-633c-4714-896d-d87efa35acbd',
      name: 'Demo Learner',
      email: 'learner@example.com',
      role: 'LEARNER',
      isEmailVerified: false,
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
      { name: 'Demo Learner', email: 'learner@example.com', password: 'short' },
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
