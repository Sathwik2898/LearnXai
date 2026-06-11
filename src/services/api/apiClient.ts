import { env } from '../../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiRequestOptions<TBody> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
};

export async function apiRequest<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers } = options;

  if (!env.apiBaseUrl) {
    throw new Error('API base URL is not configured.');
  }

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }

  return data as TResponse;
}