import { LocationRepository } from "@/domain/repositories/LocationRepository";

export class SearchLocations {
  constructor(private repo: LocationRepository) {}

  execute(query: string) {
    if (query.length < 2) return [];
    return this.repo.search(query);
  }
}