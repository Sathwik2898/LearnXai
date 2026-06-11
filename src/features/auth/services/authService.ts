import { env } from '../../../config/env';
import { apiRequest } from '../../../services/api/apiClient';
import { endpoints } from '../../../services/api/endpoints';
import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from '../types/auth.types';

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function mockLogin(request: LoginRequest): Promise<LoginResponse> {
  await wait(700);

  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: 'user_001',
      fullName: 'Demo Learner',
      email: request.email,
      role: 'learner',
    },
  };
}

async function mockRegister(request: RegisterRequest): Promise<RegisterResponse> {
  await wait(700);

  return {
    requestId: `early_access_${Date.now()}`,
    message: `Thanks ${request.fullName}. Your early access request has been received.`,
  };
}

async function mockForgotPassword(
  request: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  await wait(700);

  return {
    message: `If an account exists for ${request.email}, a reset link will be sent when access opens.`,
  };
}

export const authService = {
  login(request: LoginRequest): Promise<LoginResponse> {
    if (env.useMockApi) {
      return mockLogin(request);
    }

    return apiRequest<LoginResponse, LoginRequest>(endpoints.auth.login, {
      method: 'POST',
      body: request,
    });
  },

  register(request: RegisterRequest): Promise<RegisterResponse> {
    if (env.useMockApi) {
      return mockRegister(request);
    }

    return apiRequest<RegisterResponse, RegisterRequest>(endpoints.auth.register, {
      method: 'POST',
      body: request,
    });
  },

  forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    if (env.useMockApi) {
      return mockForgotPassword(request);
    }

    return apiRequest<ForgotPasswordResponse, ForgotPasswordRequest>(
      endpoints.auth.forgotPassword,
      {
        method: 'POST',
        body: request,
      }
    );
  },
};