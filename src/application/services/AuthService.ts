import { createAppRepositories } from "@/infrastructure/factories/createAppRepositories";
import { SignIn, SignUp, SignOut, GetCurrentUser } from "@/domain/use-cases/auth";
import { AuthCredentials, SignUpData, AuthSession } from "@/domain/repositories/AuthRepository";
import { User } from "@/domain/entities/User";

export async function signInService(credentials: AuthCredentials): Promise<AuthSession> {
  const { authRepository } = createAppRepositories();
  const useCase = new SignIn(authRepository);
  return useCase.execute(credentials);
}

export async function signUpService(data: SignUpData): Promise<AuthSession> {
  const { authRepository } = createAppRepositories();
  const useCase = new SignUp(authRepository);
  return useCase.execute(data);
}

export async function signOutService(): Promise<void> {
  const { authRepository } = createAppRepositories();
  const useCase = new SignOut(authRepository);
  return useCase.execute();
}

export async function getCurrentUserService(): Promise<User | null> {
  const { authRepository } = createAppRepositories();
  const useCase = new GetCurrentUser(authRepository);
  return useCase.execute();
}

export async function getSessionService(): Promise<AuthSession | null> {
  const { authRepository } = createAppRepositories();
  return authRepository.getSession();
}

export async function refreshSessionService(): Promise<AuthSession | null> {
  const { authRepository } = createAppRepositories();
  return authRepository.refreshSession();
}

export function onAuthStateChangeService(callback: (user: User | null) => void): () => void {
  const { authRepository } = createAppRepositories();
  return authRepository.onAuthStateChange(callback);
}
