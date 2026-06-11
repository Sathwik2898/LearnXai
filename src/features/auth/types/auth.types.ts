export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'learner' | 'admin';
  };
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  interest: string;
  message?: string;
};

export type RegisterResponse = {
  requestId: string;
  message: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};