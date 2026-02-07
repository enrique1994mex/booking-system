import { NextResponse } from "next/server";
import { createAppRepositories } from "@/infrastructure/factories/createAppRepositories";

export async function GET(
  _req: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params;

    const { bookingQueryRepository } = createAppRepositories();

    const confirmation =
      await bookingQueryRepository.getConfirmationById(bookingId);

    return NextResponse.json(confirmation);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error" },
      { status: 500 }
    );
  }
}
