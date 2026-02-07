import { createAppRepositories } from "@/infrastructure/factories/createAppRepositories";

export async function getBookingConfirmationService(bookingId: string) {
  const { bookingQueryRepository } = createAppRepositories();
  const confirmation = await bookingQueryRepository.getConfirmationById(bookingId);
  return confirmation;
}