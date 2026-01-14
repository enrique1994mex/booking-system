import { Accommodation } from "../entities/Accommodation";
import { LocationSearch } from "../value-objects/LocationSearch";

export interface AccommodationRepository {
  findAll(): Promise<Accommodation[]>;
  findById(id: string): Promise<Accommodation | null>;
  searchByLocation(search: LocationSearch): Promise<Accommodation[]>;
}