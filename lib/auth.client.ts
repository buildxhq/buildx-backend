import { jwtDecode } from 'jwt-decode';

export function decodeToken(token: string | null) {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

