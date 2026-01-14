import { AccommodationRepository } from "@/domain/repositories/AccommodationRepository";
import { Accommodation } from "@/domain/entities/Accommodation";
import { accommodations } from "../data/accommodations";
import { LocationSearch } from "@/domain/value-objects/LocationSearch";

export class MockAccommodationRepository implements AccommodationRepository {
  async findAll(): Promise<Accommodation[]> {
    return accommodations;
  }

  async findById(id: string): Promise<Accommodation | null> {
    return accommodations.find(a => a.id === id) || null; 
  }

  async searchByLocation(search: LocationSearch): Promise<Accommodation[]> {
    return accommodations.filter(a => {
      const cityMatch = search.city
      ? a.location.city.toLowerCase().includes(search.city.toLowerCase())
      : true;

    const countryMatch = search.country
      ? a.location.country.toLowerCase().includes(search.country.toLowerCase())
      : true;

    return cityMatch && countryMatch;
    });
  }
}