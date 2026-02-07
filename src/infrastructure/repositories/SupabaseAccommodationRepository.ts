import { getSupabaseClient  } from "@/infrastructure/supabase/supabaseClient";
import { AccommodationRepository } from "@/domain/repositories/AccommodationRepository";
import { Accommodation } from "@/domain/entities/Accommodation";
import { LocationSearch } from "@/domain/use-cases/dto/LocationSearch";

interface AccommodationRow {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
}

export class SupabaseAccommodationRepository implements AccommodationRepository {

  async findAll(): Promise<Accommodation[]> {
    const { data, error } = await getSupabaseClient() 
      .from("accommodations")
      .select("*");

    if (error) throw error;

    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<Accommodation | null> {
    const { data } = await getSupabaseClient() 
      .from("accommodations")
      .select("*")
      .eq("id", id)
      .single();

    return data ? this.toDomain(data) : null;
  }

  async searchByLocation(search: LocationSearch): Promise<Accommodation[]> {
    let query = getSupabaseClient().from("accommodations").select("*");

    if (search.city) {
      query = query.ilike("city", `%${search.city}%`);
    }

    if (search.country) {
      query = query.ilike("country", `%${search.country}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(this.toDomain);
  }

  private toDomain(row: AccommodationRow): Accommodation {
    return {
      id: row.id,
      name: row.name,
      location: {
        city: row.city,
        country: row.country,
      },
      description: row.description,
      geo: {
        latitude: row.latitude,
        longitude: row.longitude,
      },
    };
  }
}
