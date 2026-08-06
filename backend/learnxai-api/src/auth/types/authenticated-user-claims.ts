export const AUTHENTICATED_USER_ROLES = [
  'LEARNER',
  'ADMIN',
  'INSTRUCTOR',
  'ORG_ADMIN',
] as const;

export type AuthenticatedUserRole = (typeof AUTHENTICATED_USER_ROLES)[number];

export type AuthenticatedUserClaims = {
  sub: string;
  email: string;
  role: AuthenticatedUserRole;
};

export function isAuthenticatedUserRole(
  value: unknown,
): value is AuthenticatedUserRole {
  return AUTHENTICATED_USER_ROLES.some((role) => role === value);
}
