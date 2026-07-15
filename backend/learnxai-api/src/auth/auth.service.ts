import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  getStatus() {
    return {
      module: 'auth',
      status: 'ready',
      usersLayer: this.usersService ? 'connected' : 'missing',
    };
  }
}
