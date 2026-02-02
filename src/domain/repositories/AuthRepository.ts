import { User } from "../entities/User";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  name: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthRepository {
  signIn(credentials: AuthCredentials): Promise<AuthSession>;
  signUp(data: SignUpData): Promise<AuthSession>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<AuthSession | null>;
  refreshSession(): Promise<AuthSession | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
