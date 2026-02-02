import { AuthRepository, AuthSession, SignUpData } from "../../repositories/AuthRepository";

export class SignUp {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(data: SignUpData): Promise<AuthSession> {
    if (!data.email || !data.password || !data.name) {
      throw new Error("Name, email, and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    if (data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    return this.authRepository.signUp(data);
  }
}
