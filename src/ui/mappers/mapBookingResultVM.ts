import { Booking } from "@/domain/entities/Booking";
import { BookingResultVM } from "../models/BookingResultVM";

export function mapBookingResultVM(booking: Booking): BookingResultVM {
   return {
    bookingId: booking.id,
    status: booking.status,
    userId: booking.userId,
    accommodation: {
      id: "",
      name: "",
      city: "",
      country: "",
    },
    room: {
      id: booking.roomId,
      type: "",
      capacity: 0,
      pricePerNight: 0,
    },
    stay: {
      from: booking.dateRange.startDate.toISOString().slice(0, 10),
      to: booking.dateRange.endDate.toISOString().slice(0, 10),
      nights: booking.dateRange.numberOfNights,
      totalPrice: booking.totalPrice.amount,
      currency: booking.totalPrice.currency,
    },
  };
}
