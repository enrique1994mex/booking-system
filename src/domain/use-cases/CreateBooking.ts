import { Booking } from '../entities/Booking';
import { BookingRepository } from '../repositories/BookingRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { DateRange } from '../value-objects/DateRange';

export class CreateBooking {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  async execute(input: {
    userId: string,
    roomId: string,
    dateRange: DateRange
  }): Promise<Booking> {
    const { userId, roomId, dateRange } = input;

    // Obtener habitación
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new Error('Room not found');
    } 

    // Persistir booking
    const persistedBooking = await this.bookingRepository.create({
      userId: userId,
      roomId: roomId, 
      dateRange: dateRange
    });

    return persistedBooking;
  }
}