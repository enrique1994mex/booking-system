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
}

export class SupabaseBookingRepository implements BookingRepository {

  async save(booking: Booking): Promise<void> {
    const { error } = await supabase.from("bookings").insert({
      user_id: booking.userId,
      room_id: booking.roomId,
      from_date: booking.dateRange.startDate,
      to_date: booking.dateRange.endDate,
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
      totalPrice: new Money(0), 
      status: BookingStatus.CONFIRMED,
    };
  }
}
