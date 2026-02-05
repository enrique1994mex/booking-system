import { Booking, BookingStatus } from "../entities/Booking";
import { DateRange } from "../value-objects/DateRange";

export interface BookingRepository {
  create(input: {
    userId: string;
    roomId: string;
    dateRange: DateRange;
  }): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findById(bookingId: string): Promise<Booking | null>;
  updateStatus(bookingId: string, status: BookingStatus | string): Promise<Booking>;
}