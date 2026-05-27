import client from './client';
import type { AuthResponse } from '../types';

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', { username, password });
  return res.data;
}

export async function register(
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/register', { username, password, role });
  return res.data;
}
