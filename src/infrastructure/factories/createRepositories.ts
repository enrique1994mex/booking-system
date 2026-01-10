import { MockRoomRepository } from "../repositories/MockRoomRepository";
import { MockAccommodationRepository } from "../repositories/MockAccommodationRepository";

export function createRepositories() {
  return {
    roomRepository: new MockRoomRepository(),
    accommodationRepository: new MockAccommodationRepository(),
  }
}