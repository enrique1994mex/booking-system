import { AccommodationRepository } from "../repositories/AccommodationRepository";
import { RoomRepository } from "../repositories/RoomRepository";
import { DateRange } from "../value-objects/DateRange";
import { AccommodationSearchResult } from "./dto/AccommodationSearchResult";

export class SearchAccommodations {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  async execute(input: {
    location: string;
    dateRange: DateRange;
  }): Promise<AccommodationSearchResult[]> {
    const { location, dateRange } = input;

    // Buscar alojamientos por ubicación
    const accommodations = await this.accommodationRepository.searchByLocation(location);

    // Si no hay alojamientos, retornar vacío
    if (accommodations.length === 0) {
      return [];
    }

    // Filtrar alojamientos con habitaciones disponibles en el rango de fechas
    const results: AccommodationSearchResult[] = [];

    for (const accommodation of accommodations) {
      const rooms = await this.roomRepository.findAvailableRooms(
        accommodation.id,
        dateRange
      );

      if (rooms.length === 0) continue;

      const priceFrom = Math.min(
        ...rooms.map((room) => room.pricePerNight)
      );

      results.push({
        id: accommodation.id,
        name: accommodation.name,
        location: accommodation.location.city,
        priceFrom,
      });
    }

    return results;
  }
}