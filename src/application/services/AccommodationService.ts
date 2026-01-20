import { createRepositories } from "@/infrastructure/factories/createRepositories";
import { GetAccommodationAvailability } from "@/domain/use-cases/GetAccommodationAvailability";
import { DateRange } from "@/domain/value-objects/DateRange";

export async function getAccommodationAvailabilityService(
  accommodationId: string,
  startDate: string,
  endDate: string
) {
  const { roomRepository, accommodationRepository } = createRepositories();

  const dateRange = new DateRange(
    new Date(startDate),
    new Date(endDate)
  );

  const useCase = new GetAccommodationAvailability(roomRepository, accommodationRepository);

  return useCase.execute({
    accommodationId,
    dateRange,
  });
}