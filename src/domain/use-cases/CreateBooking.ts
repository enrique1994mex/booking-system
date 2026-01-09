import { Booking, BookingStatus } from '../entities/Booking';
import { BookingRepository } from '../repositories/BookingRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { DateRange } from '../value-objects/DateRange';
import { Money } from '../value-objects/Money';

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

    // Verificar la disponibilidad de la habitación
    const existingBookings = await this.bookingRepository.findByRoomId(roomId);

    const isOverlapping = existingBookings.some(booking =>
      booking.dateRange.overlaps(dateRange)
    );

    if (isOverlapping) {
      throw new Error('Room is not available for the selected dates');
    }

    // Obtener habitación
    const rooms = await this.roomRepository.findAvailableRooms(
      '', // no necesitamos accommodation aquí
      dateRange
    );

    const room = rooms.find(r => r.id === roomId);

    if (!room) {
      throw new Error('Room not found');
    }

     // Calcular precio
    const pricePerNight = new Money(room.pricePerNight);
    const totalPrice = pricePerNight.multiply(dateRange.numberOfNights);

    // Crear booking
    const booking: Booking = {
      id: crypto.randomUUID(),
      userId,
      roomId,
      dateRange,
      totalPrice,
      status: BookingStatus.PENDING,
    };

    // Persistir
    await this.bookingRepository.save(booking);

    return booking;
  }
}