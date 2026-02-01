import { Booking } from "../entities/Booking";
import { DateRange } from "../value-objects/DateRange";

export interface BookingRepository {
  create(input: {
    userId: string;
    roomId: string;
    dateRange: DateRange;
  }): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByRoomId(roomId: string): Promise<Booking[]>;
}