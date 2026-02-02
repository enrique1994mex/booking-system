import { User } from "../../entities/User";
import { AuthRepository } from "../../repositories/AuthRepository";

export class GetCurrentUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
