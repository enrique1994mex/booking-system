import { BookingPreviewVM } from "../models/BookingPreviewVM";
import { RoomDetail } from "@/domain/use-cases/dto/RoomDetail";

export function mapBookingPreviewVM(
  data: RoomDetail,
  dateRange: { from: string; to: string }
): BookingPreviewVM {

  const from = new Date(dateRange.from);
  const to = new Date(dateRange.to);

  const diffMs = to.getTime() - from.getTime();
  const numberOfNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const totalPrice = data.room.pricePerNight * numberOfNights;

  return {
    roomId: data.room.id,

    accommodation: {
      id: data.accommodation.id,
      name: data.accommodation.name,
      city: data.accommodation.location.city,
      country: data.accommodation.location.country,
    },

    room: {
      type: data.room.type,
      capacity: data.room.capacity,
      pricePerNight: data.room.pricePerNight,
    },

    stay: {
      from: dateRange.from,
      to: dateRange.to,
      nights: numberOfNights,
      totalPrice,
    },
  };
}
