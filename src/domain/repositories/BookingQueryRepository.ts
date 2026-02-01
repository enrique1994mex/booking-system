import { BookingConfirmation } from "../read-models/BookingConfirmation";

export interface BookingQueryRepository {
  getConfirmationById(bookingId: string): Promise<BookingConfirmation>;
}