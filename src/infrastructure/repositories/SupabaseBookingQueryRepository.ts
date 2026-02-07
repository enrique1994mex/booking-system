import { getSupabaseClient } from "@/infrastructure/supabase/supabaseClient";
import { getSupabaseServiceClient } from "@/infrastructure/supabase/supabaseServiceClient";
import { BookingQueryRepository } from "@/domain/repositories/BookingQueryRepository";
import { BookingConfirmation } from "@/domain/read-models/BookingConfirmation";

export class SupabaseBookingQueryRepository implements BookingQueryRepository {

  private supabase: ReturnType<typeof getSupabaseClient>;

  constructor(opts?: { role?: "anon" | "service" }) {
    this.supabase =
      opts?.role === "service"
        ? getSupabaseServiceClient()
        : getSupabaseClient();
  }

  async getConfirmationById(
    bookingId: string
  ): Promise<BookingConfirmation> {

    const { data, error } = await this.supabase
      .from("booking_confirmations_view")
      .select("*")
      .eq("booking_id", bookingId)
      .single();

    if (error) throw error;

    return data as BookingConfirmation;
  }
}