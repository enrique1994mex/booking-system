import { BookingConfirmation } from "@/domain/read-models/BookingConfirmation";
import { BookingResultVM } from "../models/BookingResultVM";

export function mapBookingResultVM(row: BookingConfirmation): BookingResultVM {
   return {
    bookingId: row.booking_id,
    status: row.status,
    userId: row.user_id,
    accommodation: {
      id: row.accommodation_id.toString(),
      name: row.accommodation_name,
      city: row.city,
      country: row.country,
    },
    room: {
      id: row.room_id.toString(),
      type: row.room_type,
      capacity: row.capacity,
      pricePerNight: row.price_per_night,
    },
    stay: {
      from: row.from_date,
      to: row.to_date,
      nights: row.nights,
      totalPrice: row.total_amount,
      currency: row.currency,
    },
  };
}
