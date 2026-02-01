import { createRepositories } from "@/infrastructure/factories/createRepositories";

export async function getBookingConfirmationService(bookingId: string) {
  const { bookingQueryRepository } = createRepositories();
  const confirmation = await bookingQueryRepository.getConfirmationById(bookingId);
  return confirmation;
}