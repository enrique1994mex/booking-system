import { getSupabaseClient } from "@/infrastructure/db/supabaseClient";
import { BookingRepository } from "@/domain/repositories/BookingRepository";
import { Booking } from "@/domain/entities/Booking";
import { BookingStatus } from "@/domain/entities/Booking";
import { DateRange } from "@/domain/value-objects/DateRange";
import { Money } from "@/domain/value-objects/Money";

interface BookingRow {
  id: string;
  user_id: string;
  room_id: string;
  from_date: string;
  to_date: string;
  total_amount: number;
  currency: string;
  status: BookingStatus;
}

export class SupabaseBookingRepository implements BookingRepository {

  async create(input: {
    userId: string;
    roomId: string;
    dateRange: DateRange;
  }): Promise<Booking> {

    const { data, error } = await getSupabaseClient().rpc("create_booking_atomic",
      {
        p_user_id: input.userId,
        p_room_id: Number(input.roomId),
        p_from: input.dateRange.startDate.toISOString().split("T")[0],
        p_to: input.dateRange.endDate.toISOString().split("T")[0],
      }
    );

    if (error) {
      console.error("RPC error:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Room is not available for selected dates");
    }

    // Normalizamos: Supabase puede devolver objeto o array
    const row = Array.isArray(data) ? data[0] : data;

    return {
      id: row.id,
      userId: row.user_id,
      roomId: row.room_id.toString(),
      dateRange: new DateRange(
        new Date(row.from_date),
        new Date(row.to_date)
      ),
      totalPrice: new Money(Number(row.total_amount), row.currency),
      status: row.status,
    };
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const { data } = await getSupabaseClient()
      .from("bookings")
      .select("*")
      .eq("user_id", userId);

    return data?.map(this.toDomain) ?? [];
  }

  private toDomain(row: BookingRow): Booking {
    return {
      id: row.id,
      userId: row.user_id,
      roomId: row.room_id,
      dateRange: new DateRange(new Date(row.from_date), new Date(row.to_date)),
      totalPrice: new Money(row.total_amount, row.currency),
      status: row.status,
    };
  }

  async findById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await getSupabaseClient()
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !data) {
      return null;
    }

    return this.toDomain(data);
  }

  async updateStatus(bookingId: string, status: BookingStatus | string ): Promise<Booking> {
    const { data, error } = await getSupabaseClient()
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select()
      .single();

    if (error || !data) {
      throw new Error("Failed to update booking status");
    }

    return this.toDomain(data);
  }
}
