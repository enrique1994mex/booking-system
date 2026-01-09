import { RoomRepository } from "@/domain/repositories/RoomRepository";
import { Room } from "@/domain/entities/Room";
import { DateRange } from "@/domain/value-objects/DateRange";
import { rooms } from "../data/rooms";
import { bookings } from "../data/bookings";

export class MockRoomRepository implements RoomRepository {
  async findById(roomId: string): Promise<Room | null> {
    return rooms.find(r => r.id === roomId) || null;
  }

   async findByAccommodationId(accommodationId: string): Promise<Room[]> {
    return rooms.filter(r => r.accommodationId === accommodationId);
  }

  async findAvailableRooms(
    accommodationId: string,
    dateRange: DateRange
  ): Promise<Room[]> {
    const accommodationRooms = rooms.filter(r => r.accommodationId === accommodationId);

    return accommodationRooms.filter(room => {
      const roomBookings =
        bookings.filter(b => b.roomId === room.id);

      return !roomBookings.some(b =>
        b.dateRange.overlaps(dateRange)
      );
    });
  }
}