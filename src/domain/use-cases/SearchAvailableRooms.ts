import { AccommodationRepository } from '../repositories/AccommodationRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { DateRange } from '../value-objects/DateRange';
import { AvailableRoom } from './dto/AvailableRoom';

export class SearchAvailableRooms {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  async execute(input: {
    location: string;
    dateRange: DateRange;
  }): Promise<AvailableRoom[]> {
    const { location, dateRange } = input;

     // Buscar alojamientos por ubicación
    const accommodations = await this.accommodationRepository.searchByLocation(location);

    if (accommodations.length === 0) {
      return [];
    }

    // Buscar habitaciones disponibles por alojamiento
    const availableRooms: AvailableRoom[] = [];

    for (const accommodation of accommodations) {
      const rooms =
        await this.roomRepository.findAvailableRooms(
          accommodation.id,
          dateRange
        );

      for (const room of rooms) {
        availableRooms.push({
          room,
          accommodation,
        });
      }
    }

    return availableRooms;
  }
}