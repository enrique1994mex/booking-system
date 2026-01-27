import { createRepositories } from "@/infrastructure/factories/createRepositories";
import { GetRoomDetail } from "@/domain/use-cases/GetRoomDetail";

export async function getRoomDetailService(roomId: string) {
  const { roomRepository, accommodationRepository } = createRepositories();

  const useCase = new GetRoomDetail(
    roomRepository,
    accommodationRepository
  );

  return useCase.execute(roomId);
}