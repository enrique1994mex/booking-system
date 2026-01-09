import { Room } from "../entities/Room";
import { DateRange } from "../value-objects/DateRange";

export interface RoomRepository {
  findById(roomId: string): Promise<Room | null>;

  findByAccommodationId(accommodationId: string): Promise<Room[]>;

  findAvailableRooms(
    accommodationId: string,
    dateRange: DateRange
  ): Promise<Room[]>;
}