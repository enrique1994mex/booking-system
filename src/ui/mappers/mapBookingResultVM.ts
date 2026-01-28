import { Booking } from "@/domain/entities/Booking";
import { BookingResultVM } from "../models/BookingResultVM";

export function mapBookingResultVM(booking: Booking): BookingResultVM {
  return {
    id: booking.id,
    status: booking.status,
    roomId: booking.roomId,
    userId: booking.userId,
    from: booking.dateRange.startDate.toISOString().split("T")[0],
    to: booking.dateRange.endDate.toISOString().split("T")[0],
    totalPrice: booking.totalPrice.amount,
    currency: booking.totalPrice.currency,
  };
}
