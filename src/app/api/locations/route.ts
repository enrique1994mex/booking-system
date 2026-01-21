import { NextResponse } from "next/server";
import { MapboxLocationRepository } from "@/infrastructure/repositories/MapboxLocationRepository";
import { SearchLocations } from "@/domain/use-cases/SearchLocation";
import { LocationApiDTO } from "./dto/LocationApiDTO";

const repo = new MapboxLocationRepository();
const searchLocations = new SearchLocations(repo);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";

  const locations = await searchLocations.execute(query);

  const response: LocationApiDTO[] = locations.map(loc => ({
    id: loc.id,
    name: loc.name,
    country: loc.country
  }));
  return NextResponse.json(response);
}