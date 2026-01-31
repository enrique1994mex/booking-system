import { supabase } from "@/infrastructure/db/supabaseClient";
import { RoomRepository } from "@/domain/repositories/RoomRepository";
import { Room } from "@/domain/entities/Room";
import { DateRange } from "@/domain/value-objects/DateRange";

interface RoomRow {
  id: string;
  accommodation_id: string;
  type: string;
  capacity: number;
  price_per_night: number;
}

export class SupabaseRoomRepository implements RoomRepository {

  async findById(roomId: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) throw error;
    return data ? this.toDomain(data) : null;
  }

  async findByAccommodationId(accommodationId: string): Promise<Room[]> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("accommodation_id", accommodationId);
    if (error) throw error;
    return data ? data.map(this.toDomain) : [];
  }

  async findAvailableRooms(accommodationId: string, dateRange: DateRange): Promise<Room[]> {

    const from = dateRange.startDate.toISOString().split("T")[0];
    const to = dateRange.endDate.toISOString().split("T")[0];

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("*")
      .eq("accommodation_id", accommodationId);

    if (roomsError) throw roomsError;

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("room_id")
      .lt("from_date", to)
      .gt("to_date", from);

    if (bookingsError) throw bookingsError;

    const bookedRoomIds = new Set(bookings?.map(b => b.room_id));

    return rooms
      ?.filter(room => !bookedRoomIds.has(room.id))
      .map(this.toDomain) ?? [];
  }

  private toDomain(row: RoomRow): Room {
    return {
      id: row.id,
      accommodationId: row.accommodation_id,
      type: row.type,
      capacity: row.capacity,
      pricePerNight: row.price_per_night,
    };
  }
}