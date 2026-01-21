import { NextResponse } from "next/server";
import { MapboxLocationRepository } from "@/infrastructure/repositories/MapboxLocationRepository";
import { SearchLocations } from "@/domain/use-cases/SearchLocation";
import { LocationApiDTO } from "./dto/LocationApiDTO";

const repo = new MapboxLocationRepository();
const searchLocations = new SearchLocations(repo);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";

    if (!query) {
      return NextResponse.json([]);
    }

    const locations = await searchLocations.execute(query);

    if (!locations || !Array.isArray(locations)) {
      return NextResponse.json([], { status: 200 });
    }

    const response: LocationApiDTO[] = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      country: loc.country
    }));
    return NextResponse.json(response);
  } catch (error) {
    console.error("Location API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}