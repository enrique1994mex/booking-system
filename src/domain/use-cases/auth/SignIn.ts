import { AuthRepository, AuthSession, AuthCredentials } from "../../repositories/AuthRepository";

export class SignIn {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<AuthSession> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error("Invalid email format");
    }

    return this.authRepository.signIn(credentials);
  }
}
