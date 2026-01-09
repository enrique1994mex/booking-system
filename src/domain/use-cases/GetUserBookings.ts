import { Booking } from '../entities/Booking';
import { BookingRepository } from '../repositories/BookingRepository';

export class GetUserBookings {
  constructor(
    private readonly bookingRepository: BookingRepository
  ) {}

  async execute(userId: string): Promise<Booking[]> {
    if (!userId) {
      throw new Error('UserId is required');
    }

    const bookings = await this.bookingRepository.findByUserId(userId);

    return bookings;
  }
}