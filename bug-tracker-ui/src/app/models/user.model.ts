export interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
  createdAt?: Date;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
