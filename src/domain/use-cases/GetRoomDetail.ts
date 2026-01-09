import { RoomRepository } from '../repositories/RoomRepository';
import { AccommodationRepository } from '../repositories/AccommodationRepository';
import { RoomDetail } from './dto/RoomDetail';

export class GetRoomDetail {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly accommodationRepository: AccommodationRepository
  ) {}

  async execute(roomId: string): Promise<RoomDetail> {
    // Obtener habitación
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new Error('Room not found');
    }

    // Obtener alojamiento
    const accommodation = await this.accommodationRepository.findById(room.accommodationId);

    if (!accommodation) {
      throw new Error('Accommodation not found');
    }

    // Retornar detalle
    return {
      room,
      accommodation
    };
  }
}
