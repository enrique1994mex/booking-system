import { LocationRepository } from "@/domain/repositories/LocationRepository";
import { Location } from "@/domain/entities/Location";

const mockLocations: Location[] = [
  { id: "1", name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
  { id: "2", name: "Barcelona", country: "Spain", latitude: 41.3851, longitude: 2.1734 },
  { id: "3", name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { id: "4", name: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { id: "5", name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964 },
  { id: "6", name: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050 },
  { id: "7", name: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041 },
  { id: "8", name: "Lisbon", country: "Portugal", latitude: 38.7223, longitude: -9.1393 },
];

export class MockLocationRepository implements LocationRepository {
  async search(query: string): Promise<Location[]> {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    return mockLocations.filter(
      loc =>
        loc.name.toLowerCase().includes(lowerQuery) ||
        loc.country.toLowerCase().includes(lowerQuery)
    );
  }
}
