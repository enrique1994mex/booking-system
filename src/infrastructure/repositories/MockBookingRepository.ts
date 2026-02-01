// import { BookingRepository } from "@/domain/repositories/BookingRepository";
// import { Booking } from "@/domain/entities/Booking";
// import { bookings } from "../data/bookings";

// export class MockBookingRepository implements BookingRepository {
//   async save(booking: Booking): Promise<void> {
//     bookings.push(booking);
//   }

//   async findByUserId(userId: string): Promise<Booking[]> {
//     return bookings.filter(b => b.userId === userId);
//   }

//   async findByRoomId(roomId: string): Promise<Booking[]> {
//     return bookings.filter(b => b.roomId === roomId);
//   }
// }