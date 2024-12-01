export interface LoginRequest {
  email: string;
  password: string;
  adminCode?: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  lastActive: Date;
  status: 'active' | 'banned';
} 