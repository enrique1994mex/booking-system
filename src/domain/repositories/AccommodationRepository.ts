import { Accommodation } from "../entities/Accommodation";

export interface AccommodationRepository {
  findAll(): Promise<Accommodation[]>;
  findById(id: string): Promise<Accommodation | null>;
  searchByLocation(location: string): Promise<Accommodation[]>;
}