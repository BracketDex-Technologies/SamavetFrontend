export interface ApiAuthSession {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const SESSION_KEY = 'digital-vargani-admin-session';
const SESSION_EXPIRED_EVENT = 'digital-vargani-session-expired';

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  session?: ApiAuthSession | null,
): Promise<T> {
  const response = await fetchWithAuth(path, options, session);

  if (response.status === 401 && session?.refreshToken && path !== '/auth/refresh') {
    const refreshed = await refreshSession(session);
    if (refreshed) {
      const retryResponse = await fetchWithAuth(path, options, session);
      if (!retryResponse.ok) {
        throw new Error(readErrorMessage(await retryResponse.text(), retryResponse.status));
      }

      return retryResponse.json() as Promise<T>;
    }
  }

  if (!response.ok) {
    throw new Error(readErrorMessage(await response.text(), response.status));
  }

  return response.json() as Promise<T>;
}

async function fetchWithAuth(path: string, options: RequestInit, session?: ApiAuthSession | null) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...options.headers,
    },
  });
}

async function refreshSession(session: ApiAuthSession) {
  try {
    const response = await fetchWithAuth('/auth/refresh', {
      body: JSON.stringify({ refreshToken: session.refreshToken }),
      method: 'POST',
    });

    if (!response.ok) {
      expireStoredSession();
      return false;
    }

    const nextSession = await response.json() as ApiAuthSession;
    session.accessToken = nextSession.accessToken;
    session.refreshToken = nextSession.refreshToken;
    session.user = nextSession.user;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    return true;
  } catch {
    expireStoredSession();
    return false;
  }
}

function expireStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}

export function normalizeApiBaseUrl(value?: string) {
  const baseUrl = (value || 'https://digital-vargani-api.vercel.app').replace(/\/$/, '');
  if (/\/api\/v\d+$/.test(baseUrl)) return baseUrl;
  if (baseUrl.endsWith('/api')) return `${baseUrl}/v1`;
  return `${baseUrl}/api/v1`;
}

function readErrorMessage(body: string, status: number) {
  try {
    const parsed = JSON.parse(body) as { error?: string; message?: string | string[] };
    if (Array.isArray(parsed.message)) return parsed.message.join(', ');
    return parsed.message || parsed.error || `Request failed with ${status}`;
  } catch {
    return `Request failed with ${status}`;
  }
}
