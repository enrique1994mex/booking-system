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
  {
    id: 'room-3',
    accommodationId: 'acc-2',
    type: 'Single',
    capacity: 1,
    pricePerNight: 80,
  },
  {
    id: 'room-4',
    accommodationId: 'acc-3',
    type: 'Double',
    capacity: 2,
    pricePerNight: 150,
  },
  {
    id: 'room-5',
    accommodationId: 'acc-4',
    type: 'Suite',
    capacity: 4,
    pricePerNight: 200,
  },
];