import { Accommodation } from "@/domain/entities/Accommodation";

export const accommodations: Accommodation[] = [
  {
    id: 'acc-1',
    name: 'Hotel Central',
    location: {
      city: 'Paris',
      country: 'France',
    },
    description: 'Hotel céntrico cerca de atracciones',
    geo: { latitude: 48.8566, longitude: 2.3522 },
  },
];