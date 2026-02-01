import { supabase } from "@/infrastructure/db/supabaseClient";
import { BookingQueryRepository } from "@/domain/repositories/BookingQueryRepository";
import { BookingConfirmation } from "@/domain/read-models/BookingConfirmation";

export class SupabaseBookingQueryRepository implements BookingQueryRepository {

  async getConfirmationById(
    bookingId: string
  ): Promise<BookingConfirmation> {

    const { data, error } = await supabase
      .from("booking_confirmations_view")
      .select("*")
      .eq("booking_id", bookingId)
      .single();

    if (error) throw error;

    return data as BookingConfirmation;
  }
}