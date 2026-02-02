import { AuthError, User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/domain/entities/User";
import { AuthRepository, AuthCredentials, SignUpData, AuthSession } from "@/domain/repositories/AuthRepository";
import { getSupabaseClient } from "../db/supabaseClient";

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

function mapSupabaseUserToUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: supabaseUser.user_metadata?.name ?? supabaseUser.email?.split("@")[0] ?? "",
  };
}

function handleAuthError(error: AuthError): never {
  const errorMessages: Record<string, string> = {
    invalid_credentials: "Invalid email or password",
    email_not_confirmed: "Please verify your email before signing in",
    user_already_exists: "An account with this email already exists",
    weak_password: "Password is too weak",
    invalid_email: "Invalid email address",
  };

  const message = errorMessages[error.code ?? ""] ?? error.message;
  throw new AuthenticationError(message, error.code);
}

export class SupabaseAuthRepository implements AuthRepository {
  private supabase = getSupabaseClient();

  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      handleAuthError(error);
    }

    if (!data.user || !data.session) {
      throw new AuthenticationError("Sign in failed: no user data returned");
    }

    return {
      user: mapSupabaseUserToUser(data.user),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
    };
  }

  async signUp(data: SignUpData): Promise<AuthSession> {
    const { data: authData, error } = await this.supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      handleAuthError(error);
    }

    if (!authData.user) {
      throw new AuthenticationError("Sign up failed: no user data returned");
    }

    // Supabase may not return a session if email confirmation is required
    if (!authData.session) {
      return {
        user: mapSupabaseUserToUser(authData.user),
        accessToken: "",
        refreshToken: "",
        expiresAt: 0,
      };
    }

    return {
      user: mapSupabaseUserToUser(authData.user),
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt: authData.session.expires_at ?? 0,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      handleAuthError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      // Not authenticated is not an error, just return null
      if (error.code === "session_not_found" || error.code === "user_not_found") {
        return null;
      }
      handleAuthError(error);
    }

    if (!data.user) {
      return null;
    }

    return mapSupabaseUserToUser(data.user);
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      handleAuthError(error);
    }

    if (!data.session) {
      return null;
    }

    const { data: userData } = await this.supabase.auth.getUser();
    if (!userData.user) {
      return null;
    }

    return {
      user: mapSupabaseUserToUser(userData.user),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
    };
  }

  async refreshSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.refreshSession();

    if (error) {
      // Session expired or invalid, return null instead of throwing
      return null;
    }

    if (!data.session || !data.user) {
      return null;
    }

    return {
      user: mapSupabaseUserToUser(data.user),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
    };
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data } = this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback(mapSupabaseUserToUser(session.user));
      } else {
        callback(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }
}
