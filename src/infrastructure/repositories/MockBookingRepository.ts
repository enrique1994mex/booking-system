import { BookingRepository } from "@/domain/repositories/BookingRepository";
import { BookingQueryRepository } from "@/domain/repositories/BookingQueryRepository";
import { Booking, BookingStatus } from "@/domain/entities/Booking";
import { BookingConfirmation } from "@/domain/read-models/BookingConfirmation";
import { DateRange } from "@/domain/value-objects/DateRange";
import { Money } from "@/domain/value-objects/Money";
import { bookings } from "../data/bookings";
import { rooms } from "../data/rooms";
import { accommodations } from "../data/accommodations";

export class MockBookingRepository implements BookingRepository, BookingQueryRepository {
  async create(input: {
    userId: string;
    roomId: string;
    dateRange: DateRange;
  }): Promise<Booking> {
    const room = rooms.find(r => r.id === input.roomId);
    if (!room) {
      throw new Error(`Room not found: ${input.roomId}`);
    }

    const nights = input.dateRange.numberOfNights;
    const totalAmount = room.pricePerNight * nights;

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      userId: input.userId,
      roomId: input.roomId,
      dateRange: input.dateRange,
      totalPrice: new Money(totalAmount, "EUR"),
      status: BookingStatus.CONFIRMED,
    };

    bookings.push(booking);
    return booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return bookings.filter(b => b.userId === userId);
  }

  async getConfirmationById(bookingId: string): Promise<BookingConfirmation> {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    const room = rooms.find(r => r.id === booking.roomId);
    if (!room) {
      throw new Error(`Room not found: ${booking.roomId}`);
    }

    const accommodation = accommodations.find(a => a.id === room.accommodationId);
    if (!accommodation) {
      throw new Error(`Accommodation not found: ${room.accommodationId}`);
    }

    const nights = booking.dateRange.numberOfNights;

    return {
      booking_id: booking.id,
      status: booking.status,
      user_id: booking.userId,
      accommodation_id: parseInt(accommodation.id.replace("acc-", "")),
      accommodation_name: accommodation.name,
      city: accommodation.location.city,
      country: accommodation.location.country,
      room_id: parseInt(room.id.replace("room-", "")),
      room_type: room.type,
      capacity: room.capacity,
      price_per_night: room.pricePerNight,
      from_date: booking.dateRange.startDate.toISOString().split("T")[0],
      to_date: booking.dateRange.endDate.toISOString().split("T")[0],
      nights,
      total_amount: booking.totalPrice.amount,
      currency: booking.totalPrice.currency,
    };
  }
}
