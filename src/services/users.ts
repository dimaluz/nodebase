'use server';

export type User = {
  id: string;
  email: string;
  fullName: string;
};

export type FetchUsersOptions = {
  bearerToken?: string;
  userId?: string;
};

const mockUsers: User[] = [
  { id: 'user_123', email: 'demo@example.com', fullName: 'Demo User' },
  { id: 'user_456', email: 'alex@example.com', fullName: 'Alex Johnson' },
];

/**
 * Fetches users from the BFF layer. Falls back to mock data until the backend is ready.
 */
const fetchUsersFromBff = async (options: FetchUsersOptions = {}): Promise<User[]> => {
  const baseUrl = process.env.BFF_BASE_URL;

  if (!baseUrl) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[users-service] Missing BFF_BASE_URL env variable; returning mock users.');
    }
    return mockUsers;
  }

  try {
    const url = new URL('/users', baseUrl);
    if (options.userId) {
      url.searchParams.set('userId', options.userId);
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (options.bearerToken) {
      headers.Authorization = `Bearer ${options.bearerToken}`;
    }

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch users from BFF: ${response.status} ${response.statusText}`);
      return mockUsers;
    }

    const payload = (await response.json()) as { users?: User[] };
    return Array.isArray(payload.users) && payload.users.length > 0 ? payload.users : mockUsers;
  } catch (error) {
    console.error('[users-service] Error fetching users from BFF:', error);
    return mockUsers;
  }
};

export const getUsers = async (options: FetchUsersOptions = {}) => fetchUsersFromBff(options);
