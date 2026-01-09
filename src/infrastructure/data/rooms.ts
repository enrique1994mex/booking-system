import { Room } from "@/domain/entities/Room";

export const rooms: Room[] = [
  {
    id: 'room-1',
    accommodationId: 'acc-1',
    type: 'Double',
    capacity: 2,
    pricePerNight: 120,
  },
  {
    id: 'room-2',
    accommodationId: 'acc-1',
    type: 'Suite',
    capacity: 4,
    pricePerNight: 250,
  },
];