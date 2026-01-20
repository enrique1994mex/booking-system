import { createRepositories } from "@/infrastructure/factories/createRepositories";
import { SearchAccommodations } from "@/domain/use-cases/SearchAccommodations";
import { LocationSearch } from "@/domain/use-cases/dto/LocationSearch";
import { DateRange } from "@/domain/value-objects/DateRange";

export async function searchAccommodationsService(
  location: LocationSearch, 
  startDate: string, 
  endDate: string
) {
  const { roomRepository, accommodationRepository } = createRepositories();

  const dateRange = new DateRange(
    new Date(startDate),
    new Date(endDate)
  );

  const useCase = new SearchAccommodations(accommodationRepository, roomRepository);

  return useCase.execute({location, dateRange});
}