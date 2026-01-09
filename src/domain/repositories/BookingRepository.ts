import { Booking } from "../entities/Booking";

export interface BookingRepository {
  save(booking: Booking): Promise<void>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByRoomId(roomId: string): Promise<Booking[]>;
}