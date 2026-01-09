import { Room } from "../../entities/Room";
import { Accommodation } from "../../entities/Accommodation";

export interface AvailableRoom {
  room: Room;
  accommodation: Accommodation;
}