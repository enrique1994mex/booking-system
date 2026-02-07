import { createAppRepositories } from "@/infrastructure/factories/createAppRepositories";
import { SearchLocations } from "@/domain/use-cases/SearchLocation";

export async function searchLocationsService(query: string) {
  const { locationRepository } = createAppRepositories();
  const useCase = new SearchLocations(locationRepository);
  return useCase.execute(query);
}
