import { supabase } from "@/infrastructure/db/supabaseClient";
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
}

export class SupabaseBookingRepository implements BookingRepository {

  async save(booking: Booking): Promise<void> {

    const { error } = await supabase.rpc("create_booking_atomic", {
      p_user_id: booking.userId,
      p_room_id: Number(booking.roomId),
      p_from: booking.dateRange.startDate.toISOString().split("T")[0],
      p_to: booking.dateRange.endDate.toISOString().split("T")[0],
    });

    if (error) throw error;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId);

    return data?.map(this.toDomain) ?? [];
  }

  async findByRoomId(roomId: string): Promise<Booking[]> {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("room_id", roomId);

    return data?.map(this.toDomain) ?? [];
  }

  private toDomain(row: BookingRow): Booking {
    return {
      id: row.id,
      userId: row.user_id,
      roomId: row.room_id,
      dateRange: new DateRange(new Date(row.from_date), new Date(row.to_date)),
      totalPrice: new Money(row.total_amount, row.currency),
      status: BookingStatus.CONFIRMED,
    };
  }
}
