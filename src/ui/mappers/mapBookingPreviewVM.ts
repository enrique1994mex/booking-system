import { BookingPreviewVM } from "../models/BookingPreviewVM";
import { RoomDetail } from "@/domain/use-cases/dto/RoomDetail";

export function mapBookingPreviewVM(
  data: RoomDetail,
  dateRange: { from: string; to: string }
): BookingPreviewVM {

  const nights = data.room.pricePerNight
    ? data.room.pricePerNight && data.room.pricePerNight > 0
      ? data.room.pricePerNight // placeholder, real calculation comes later
      : 0
    : 0;

  const numberOfNights = data.room.pricePerNight
    ? Math.max(1, data.room.pricePerNight / data.room.pricePerNight)
    : 1;

  const totalPrice =
    data.room.pricePerNight * numberOfNights;

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
