import { CreateBooking } from "@/domain/use-cases/CreateBooking";
import { createAppRepositories } from "@/infrastructure/factories/createAppRepositories";
import { DateRange } from "@/domain/value-objects/DateRange";

export async function createBookingService(params: {
  userId: string;
  roomId: string;
  dateRange: { from: string; to: string };
}) {
  const { bookingRepository, roomRepository } = createAppRepositories();

  const useCase = new CreateBooking(
    bookingRepository,
    roomRepository
  );

  const dateRange = new DateRange(
    new Date(params.dateRange.from),
    new Date(params.dateRange.to)
  );

  const booking = await useCase.execute({
    userId: params.userId,
    roomId: params.roomId,
    dateRange,
  });

  return booking;
}

