// Client-side authentication service for SakhiShield

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'sakhishield_auth_user';

export const getStoredAuthUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setStoredAuthUser = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Storage access might be restricted
  }
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hint: string;
}

export const evaluatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return { score: 0, label: 'Weak', color: '#625B55', hint: 'Use 8+ characters with letters & numbers' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: 'Weak', color: '#F62440', hint: 'Add numbers or capital letters' };
    case 2:
      return { score: 2, label: 'Fair', color: '#D97706', hint: 'Add a special symbol or make it longer' };
    case 3:
      return { score: 3, label: 'Good', color: '#2563EB', hint: 'Strong password for your safety space' };
    case 4:
    default:
      return { score: 4, label: 'Strong', color: '#059669', hint: 'Excellent protection' };
  }
};
