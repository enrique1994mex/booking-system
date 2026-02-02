import { createRepositories } from "@/infrastructure/factories/createRepositories";
import { SearchLocations } from "@/domain/use-cases/SearchLocation";

export async function searchLocationsService(query: string) {
  const { locationRepository } = createRepositories();
  const useCase = new SearchLocations(locationRepository);
  return useCase.execute(query);
}
