import { describe, expect, it } from 'vitest';
import { normalizeApiBaseUrl, sessionForStorage } from './client';

describe('API client security helpers', () => {
  it('never persists bearer or refresh credentials', () => {
    const user = { id: 'user-1', role: 'MANDAL_ADMIN' };
    const stored = sessionForStorage({
      accessToken: 'access-secret',
      refreshToken: 'refresh-secret',
      user,
    });

    expect(stored).toEqual({ accessToken: '', refreshToken: undefined, user });
  });

  it('normalizes a configured API origin to the versioned API path', () => {
    expect(normalizeApiBaseUrl('https://api.example.com/')).toBe('https://api.example.com/api/v1');
    expect(normalizeApiBaseUrl('https://api.example.com/api/v1/')).toBe('https://api.example.com/api/v1');
  });
});
