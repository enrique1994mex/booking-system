import { AvailableRoom } from "@/domain/use-cases/dto/AvailableRoom";
import { AccommodationCardVM } from "../models/AccommodationCardVM";

export function mapAccommodationVM(
  dto: AvailableRoom[]
): AccommodationCardVM {
  if (dto.length === 0) {
    throw new Error('Cannot map empty accommodation availability');
  }

  const accommodation = dto[0].accommodation;
  return {
    id: accommodation.id,
    name: accommodation.name,
    location: accommodation.location,
    description: accommodation.description,
    imageUrl: `/images/hotel_1.jpg`,
    rooms: dto.map((room) => ({
      id: room.room.id,
      type: room.room.type,
      capacity: room.room.capacity,
      pricePerNight: room.room.pricePerNight,
    })),
  }
}