import { SupabaseAccommodationRepository } from "../repositories/SupabaseAccommodationRepository";
import { SupabaseRoomRepository } from "../repositories/SupabaseRoomRepository";
import { SupabaseBookingRepository } from "../repositories/SupabaseBookingRepository";
import { SupabaseBookingQueryRepository } from "../repositories/SupabaseBookingQueryRepository";
import { SupabaseAuthRepository } from "../repositories/SupabaseAuthRepository";
import { MockAccommodationRepository } from "../repositories/MockAccommodationRepository";
import { SupabasePaymentPersistenceRepository } from "../repositories/SupabasePaymentPersistenceRepository";
import { MockRoomRepository } from "../repositories/MockRoomRepository";
import { MockBookingRepository } from "../repositories/MockBookingRepository";
import { MockLocationRepository } from "../repositories/MockLocationRepository";
import { MockAuthRepository } from "../repositories/MockAuthRepository";
import { MockPaymentPersistenceRepository } from "../repositories/MockPaymentPersistenceRepository";
import { MapboxLocationRepository } from "../repositories/MapboxLocationRepository";

type RepositoryMode = "mock" | "supabase";

function getRepositoryMode(): RepositoryMode {
  const mode = process.env.NEXT_PUBLIC_REPOSITORY_MODE;
  if (mode === "mock") return "mock";
  return "supabase";
}

export function createRepositories(mode?: RepositoryMode) {
  const resolvedMode = mode ?? getRepositoryMode();

  if (resolvedMode === "mock") {
    return {
      roomRepository: new MockRoomRepository(),
      accommodationRepository: new MockAccommodationRepository(),
      bookingRepository: new MockBookingRepository(),
      bookingQueryRepository: new MockBookingRepository(),
      locationRepository: new MockLocationRepository(),
      authRepository: new MockAuthRepository(),
      paymentPersistenceRepository: new MockPaymentPersistenceRepository(),
    };
  }

  return {
    roomRepository: new SupabaseRoomRepository(),
    accommodationRepository: new SupabaseAccommodationRepository(),
    bookingRepository: new SupabaseBookingRepository(),
    bookingQueryRepository: new SupabaseBookingQueryRepository(),
    locationRepository: new MapboxLocationRepository(),
    authRepository: new SupabaseAuthRepository(),
    paymentPersistenceRepository: new SupabasePaymentPersistenceRepository(),
  };
}