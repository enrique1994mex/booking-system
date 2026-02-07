import "server-only";
import { SupabaseBookingRepository } from "../repositories/SupabaseBookingRepository";
import { SupabasePaymentPersistenceRepository } from "../repositories/SupabasePaymentPersistenceRepository";

export function createSystemRepositories() {
  return {
    bookingRepository: new SupabaseBookingRepository({
      role: "service",
    }),
    paymentPersistenceRepository: new SupabasePaymentPersistenceRepository({
      role: "service",
    }),
  };
}
