import { IUser } from '../../../types/domain-models';

export interface AuthState {
  user: IUser | null;
  role: 'customer' | 'admin' | 'delivery_partner' | null;
  token: string | null;
  isLoading: boolean;
  isAuthChecking: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface AuthFormData {
  email: string;
  password?: string;
  name?: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
  role: 'customer' | 'admin' | 'delivery_partner';
}
