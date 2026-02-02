import { NextResponse } from "next/server";
import { searchLocationsService } from "@/application/services/LocationService";
import { LocationApiDTO } from "./dto/LocationApiDTO";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";

    if (!query) {
      return NextResponse.json([]);
    }

    const locations = await searchLocationsService(query);

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