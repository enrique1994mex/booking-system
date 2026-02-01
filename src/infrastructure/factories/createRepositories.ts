import { SupabaseAccommodationRepository } from "../repositories/SupabaseAccommodationRepository";
import { SupabaseRoomRepository } from "../repositories/SupabaseRoomRepository";
import { SupabaseBookingRepository } from "../repositories/SupabaseBookingRepository";
import { SupabaseBookingQueryRepository } from "../repositories/SupabaseBookingQueryRepository";


export function createRepositories() {
  return {
    roomRepository: new SupabaseRoomRepository(),
    accommodationRepository: new SupabaseAccommodationRepository(),
    bookingRepository: new SupabaseBookingRepository(),
    bookingQueryRepository: new SupabaseBookingQueryRepository(),
  }
}