'use client';

import type { Session } from '@/services/auth';
import { polarClient } from '@polar-sh/better-auth';

export type AuthHandlers = {
  onSuccess?: (context: { session: Session }) => void;
  onError?: (context: { error: { message: string } }) => void;
};

export type EmailAuthPayload = {
  email: string;
  password: string;
  callbackURL?: string;
  name?: string;
};

const mockSession: Session = {
  user: {
    id: 'user_123',
    email: 'demo@example.com',
    fullName: 'Demo User',
  },
};

const callBff = async (
  path: string,
  payload: EmailAuthPayload,
): Promise<{ success: boolean; session: Session | null; error?: string }> => {
  const baseUrl = process.env.NEXT_PUBLIC_BFF_BASE_URL;

  if (!baseUrl) {
    console.warn(
      '[auth-client] NEXT_PUBLIC_BFF_BASE_URL is not set. Falling back to mock session.',
    );
    return { success: true, session: mockSession };
  }

  const response = await fetch(new URL(path, baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Authentication request failed');
  }

  const result = (await response.json()) as {
    success: boolean;
    session: Session | null;
    error?: string;
  };

  return result;
};

const execute = async (
  path: string,
  payload: EmailAuthPayload,
  handlers?: AuthHandlers,
) => {
  try {
    const result = await callBff(path, payload);

    if (!result.success || !result.session) {
      const message = result.error ?? 'Authentication failed.';
      handlers?.onError?.({ error: { message } });
      return;
    }

    handlers?.onSuccess?.({ session: result.session });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    handlers?.onError?.({ error: { message } });
  }
};

export const authClient = {
  signIn: {
    email: async (payload: EmailAuthPayload, handlers?: AuthHandlers) =>
      execute('/auth/login', payload, handlers),
  },
  signUp: {
    email: async (payload: EmailAuthPayload, handlers?: AuthHandlers) =>
      execute('/auth/register', payload, handlers),
  },
  plugins: [
    polarClient(),
  ],
};
