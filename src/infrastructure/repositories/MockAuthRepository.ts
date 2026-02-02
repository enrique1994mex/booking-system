import { User } from "@/domain/entities/User";
import {
  AuthRepository,
  AuthCredentials,
  SignUpData,
  AuthSession,
} from "@/domain/repositories/AuthRepository";

const mockUsers: Map<string, { user: User; password: string }> = new Map([
  [
    "test@example.com",
    {
      user: { id: "user-1", email: "test@example.com", name: "Test User" },
      password: "password123",
    },
  ],
]);

let currentSession: AuthSession | null = null;
let authChangeCallback: ((user: User | null) => void) | null = null;

export class MockAuthRepository implements AuthRepository {
  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    const userData = mockUsers.get(credentials.email);

    if (!userData || userData.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    currentSession = {
      user: userData.user,
      accessToken: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    };

    authChangeCallback?.(currentSession.user);
    return currentSession;
  }

  async signUp(data: SignUpData): Promise<AuthSession> {
    if (mockUsers.has(data.email)) {
      throw new Error("An account with this email already exists");
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
    };

    mockUsers.set(data.email, { user: newUser, password: data.password });

    currentSession = {
      user: newUser,
      accessToken: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    };

    authChangeCallback?.(currentSession.user);
    return currentSession;
  }

  async signOut(): Promise<void> {
    currentSession = null;
    authChangeCallback?.(null);
  }

  async getCurrentUser(): Promise<User | null> {
    return currentSession?.user ?? null;
  }

  async getSession(): Promise<AuthSession | null> {
    return currentSession;
  }

  async refreshSession(): Promise<AuthSession | null> {
    if (!currentSession) {
      return null;
    }

    currentSession = {
      ...currentSession,
      accessToken: `mock-token-${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    };

    return currentSession;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    authChangeCallback = callback;
    return () => {
      authChangeCallback = null;
    };
  }
}
