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
  {
    id: 'acc-2',
    name: 'Ambassador Apartments',
    location: {
      city: 'Paris',
      country: 'France',
    },
    description: 'Apartamentos modernos en el centro de la ciudad',
    geo: { latitude: 48.8584, longitude: 2.2945 },
  },
  {
    id: 'acc-3',
    name: 'Mountain Cabin',
    location: {
      city: 'Denver',
      country: 'USA',
    },
    description: 'Cabaña en la montaña con vistas panorámicas',
    geo: { latitude: 39.7392, longitude: -104.9903 },
  },
  {
    id: 'acc-4',
    name: 'Beachside Resort',
    location: {
      city: 'Miami',
      country: 'USA',
    },
    description: 'Resort frente al mar con vistas al océano',
    geo: { latitude: 25.7617, longitude: -80.1918 },
  },
];