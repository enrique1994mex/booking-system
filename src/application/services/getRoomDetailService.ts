import { createAppRepositories } from "@/infrastructure/factories/createAppRepositories";
import { GetRoomDetail } from "@/domain/use-cases/GetRoomDetail";

export async function getRoomDetailService(roomId: string) {
  const { roomRepository, accommodationRepository } = createAppRepositories();

  const useCase = new GetRoomDetail(
    roomRepository,
    accommodationRepository
  );

  return useCase.execute(roomId);
}