'use server';

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
};

export type Session = {
  user: SessionUser;
};

export type AuthResult = {
  success: boolean;
  session: Session | null;
  error?: string;
};

export type SessionRequestOptions = {
  headers?: Headers | HeadersInit;
};

export type EmailCredentials = {
  email: string;
  password: string;
  name?: string;
};

const mockSession: Session = {
  user: {
    id: 'user_123',
    email: 'demo@example.com',
    fullName: 'Demo User',
  },
};

const mockResult: AuthResult = {
  success: true,
  session: mockSession,
};

const BFF_BASE_URL = process.env.BFF_BASE_URL;

const shouldReturnMock = () => {
  if (!BFF_BASE_URL && process.env.NODE_ENV !== 'production') {
    return true;
  }
  return false;
};

const buildHeaders = (value?: Headers | HeadersInit) => {
  if (!value) return {} as Record<string, string>;
  if (value instanceof Headers) {
    const entries = Object.fromEntries(value.entries());
    const result: Record<string, string> = {};
    if (entries.cookie) result.cookie = entries.cookie;
    if (entries.authorization) result.authorization = entries.authorization;
    return result;
  }
  if (Array.isArray(value)) {
    const result: Record<string, string> = {};
    value.forEach(([key, val]) => {
      if (key.toLowerCase() === 'cookie') result.cookie = val;
      if (key.toLowerCase() === 'authorization') result.authorization = val;
    });
    return result;
  }
  const headersInit = value as Record<string, string>;
  const result: Record<string, string> = {};
  if (headersInit.cookie) result.cookie = headersInit.cookie;
  if (headersInit.Authorization || headersInit.authorization) {
    result.authorization = headersInit.Authorization ?? headersInit.authorization;
  }
  return result;
};

const fetchFromBff = async <T>(path: string, init: RequestInit = {}): Promise<T | null> => {
  if (!BFF_BASE_URL) return null;
  const url = new URL(path, BFF_BASE_URL).toString();
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`BFF request failed (${response.status}): ${text}`);
  }
  if (response.status === 204) return null;
  return (await response.json()) as T;
};

export const getSession = async (
  options: SessionRequestOptions = {},
): Promise<Session | null> => {
  try {
    const headers = buildHeaders(options.headers);
    if (shouldReturnMock()) return mockSession;

    const payload = await fetchFromBff<{ session: Session | null }>('/auth/session', {
      method: 'GET',
      headers,
    });

    if (!payload?.session) {
      return null;
    }

    return payload.session;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[auth-service] Failed to fetch session from BFF:', error);
      return mockSession;
    }
    return null;
  }
};

const authFetch = async (
  path: string,
  credentials: EmailCredentials,
): Promise<AuthResult> => {
  try {
    if (shouldReturnMock()) {
      return mockResult;
    }

    const payload = await fetchFromBff<AuthResult>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!payload) {
      return {
        success: false,
        session: null,
        error: 'Empty response from BFF.',
      };
    }

    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    if (process.env.NODE_ENV !== 'production') {
      console.error('[auth-service] Error communicating with BFF:', error);
      return mockResult;
    }
    return {
      success: false,
      session: null,
      error: message,
    };
  }
};

export const loginWithEmail = async (credentials: EmailCredentials) =>
  authFetch('/auth/login', credentials);

export const registerWithEmail = async (credentials: EmailCredentials) =>
  authFetch('/auth/register', credentials);
