import { Location } from "../entities/Location";

export interface LocationRepository {
  search(query: string): Promise<Location[]>;
}