import { AccommodationRepository } from "@/domain/repositories/AccommodationRepository";
import { Accommodation } from "@/domain/entities/Accommodation";
import { accommodations } from "../data/accommodations";

export class MockAccommodationRepository implements AccommodationRepository {
  async findAll(): Promise<Accommodation[]> {
    return accommodations;
  }

  async findById(id: string): Promise<Accommodation | null> {
    return accommodations.find(a => a.id === id) || null;
  }

  async searchByLocation(location: string): Promise<Accommodation[]> {
    return accommodations.filter(a =>
      a.location.city.toLowerCase().includes(location.toLowerCase()) ||
      a.location.country.toLowerCase().includes(location.toLowerCase())
    );
  }
}