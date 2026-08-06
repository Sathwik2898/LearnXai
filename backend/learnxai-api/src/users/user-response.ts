export type SafeUserSource = {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
};

export type SafeUserResponse = SafeUserSource;

export function toSafeUserResponse(user: SafeUserSource): SafeUserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}
