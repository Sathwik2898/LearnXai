import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 180;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationErrors = Partial<Record<keyof RegisterDto, string>>;

type NormalizedRegistration = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(input: RegisterDto) {
    const name = typeof input?.name === 'string' ? input.name.trim() : '';
    const email =
      typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
    const password = typeof input?.password === 'string' ? input.password : '';

    this.validateRegistration({ name, email, password });

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await hash(password, BCRYPT_SALT_ROUNDS);

    try {
      const user = await this.usersService.createLearner({
        name,
        email,
        passwordHash,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }

      throw error;
    }
  }

  getStatus() {
    return {
      module: 'auth',
      status: 'ready',
      usersLayer: this.usersService ? 'connected' : 'missing',
    };
  }

  private validateRegistration(input: NormalizedRegistration) {
    const errors: ValidationErrors = {};

    if (input.name.length < 2 || input.name.length > MAX_NAME_LENGTH) {
      errors.name = `Name must be between 2 and ${MAX_NAME_LENGTH} characters.`;
    }

    if (
      input.email.length > MAX_EMAIL_LENGTH ||
      !EMAIL_PATTERN.test(input.email)
    ) {
      errors.email = 'Email must be a valid email address.';
    }

    if (input.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (Buffer.byteLength(input.password, 'utf8') > MAX_PASSWORD_BYTES) {
      errors.password = `Password must not exceed ${MAX_PASSWORD_BYTES} bytes.`;
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Invalid registration input.',
        errors,
      });
    }
  }

  private isUniqueConstraintError(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
