const MIN_JWT_SECRET_LENGTH = 32;
const MIN_ACCESS_TOKEN_SECONDS = 60;
const MAX_ACCESS_TOKEN_SECONDS = 3600;

export const JWT_ACCESS_CONFIG = Symbol('JWT_ACCESS_CONFIG');

export type JwtAccessConfig = {
  secret: string;
  expiresInSeconds: number;
  issuer: string;
  audience: string;
};

export function loadJwtAccessConfig(
  environment: NodeJS.ProcessEnv = process.env,
): JwtAccessConfig {
  const secret = getRequiredValue(environment, 'JWT_ACCESS_SECRET');
  const expiresIn = getRequiredValue(environment, 'JWT_ACCESS_EXPIRES_IN');
  const issuer = getRequiredValue(environment, 'JWT_ISSUER');
  const audience = getRequiredValue(environment, 'JWT_AUDIENCE');
  const expiresInSeconds = Number(expiresIn);

  if (secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_ACCESS_SECRET must contain at least ${MIN_JWT_SECRET_LENGTH} characters.`,
    );
  }

  if (
    !Number.isInteger(expiresInSeconds) ||
    expiresInSeconds < MIN_ACCESS_TOKEN_SECONDS ||
    expiresInSeconds > MAX_ACCESS_TOKEN_SECONDS
  ) {
    throw new Error(
      `JWT_ACCESS_EXPIRES_IN must be an integer between ${MIN_ACCESS_TOKEN_SECONDS} and ${MAX_ACCESS_TOKEN_SECONDS} seconds.`,
    );
  }

  return {
    secret,
    expiresInSeconds,
    issuer,
    audience,
  };
}

function getRequiredValue(environment: NodeJS.ProcessEnv, key: string): string {
  const value = environment[key]?.trim();

  if (!value) {
    throw new Error(`${key} must be set.`);
  }

  return value;
}
