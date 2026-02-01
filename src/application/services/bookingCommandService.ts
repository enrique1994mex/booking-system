import { CreateBooking } from "@/domain/use-cases/CreateBooking";
import { createRepositories } from "@/infrastructure/factories/createRepositories";
import { DateRange } from "@/domain/value-objects/DateRange";

export async function createBookingService(params: {
  userId: string;
  roomId: string;
  dateRange: { from: string; to: string };
}) {
  const { bookingRepository, roomRepository } = createRepositories();

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

