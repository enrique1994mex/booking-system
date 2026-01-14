import { RoomRepository } from "../repositories/RoomRepository";
import { AccommodationRepository } from "../repositories/AccommodationRepository";
import { DateRange } from "../value-objects/DateRange";
import { AvailableRoom } from "./dto/AvailableRoom";

export class GetAccommodationAvailability {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly accommodationRepository: AccommodationRepository
  ) {}

  async execute(input: {
    accommodationId: string;
    dateRange: DateRange;
  }): Promise<AvailableRoom[]> {
    const { accommodationId, dateRange } = input;

    // Buscar el alojamiento por ID 
    const accommodation = await this.accommodationRepository.findById(accommodationId);

    // Si no se encuentra el alojamiento, lanzar un error
    if (!accommodation) {
      throw new Error('Accommodation not found');
    }

    // Buscar habitaciones disponibles para el alojamiento en el rango de fechas
    const rooms = await this.roomRepository.findAvailableRooms(
      accommodationId,
      dateRange
    );

    return rooms.map((room) => ({
      room,
      accommodation,
    }));
  }
}