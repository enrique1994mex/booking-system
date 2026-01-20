import { Accommodation } from "../entities/Accommodation";
import { LocationSearch } from "../use-cases/dto/LocationSearch";

export interface AccommodationRepository {
  findAll(): Promise<Accommodation[]>;
  findById(id: string): Promise<Accommodation | null>;
  searchByLocation(search: LocationSearch): Promise<Accommodation[]>;
}