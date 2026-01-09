import { Room } from "@/domain/entities/Room";
import { Accommodation } from "@/domain/entities/Accommodation";

export interface RoomDetail {
  room: Room;
  accommodation: Accommodation;
}