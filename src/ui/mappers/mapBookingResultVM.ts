import { Booking } from "@/domain/entities/Booking";
import { BookingPreviewVM } from "../models/BookingPreviewVM";
import { BookingResultVM } from "../models/BookingResultVM";

export function mapBookingResultVM(booking: Booking, preview: BookingPreviewVM): BookingResultVM {
   return {
    bookingId: booking.id,
    status: booking.status,
    userId: booking.userId,
    accommodation: {
      id: preview.accommodation.id,
      name: preview.accommodation.name,
      city: preview.accommodation.city,
      country: preview.accommodation.country,
    },
    room: {
      id: booking.roomId,
      type: preview.room.type,
      capacity: preview.room.capacity,
      pricePerNight: preview.room.pricePerNight,
    },
    stay: {
      from: preview.stay.from,
      to: preview.stay.to,
      nights: preview.stay.nights,
      totalPrice: booking.totalPrice.amount,
      currency: booking.totalPrice.currency,
    },
  };
}
