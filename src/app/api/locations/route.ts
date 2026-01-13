import { NextResponse } from "next/server";
import { MapboxLocationRepository } from "@/infrastructure/repositories/MapboxLocationRepository";
import { SearchLocations } from "@/domain/use-cases/SearchLocation";

const repo = new MapboxLocationRepository();
const searchLocations = new SearchLocations(repo);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";

  const locations = await searchLocations.execute(query);
  return NextResponse.json(locations);
}