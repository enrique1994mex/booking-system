import { LocationRepository } from "@/domain/repositories/LocationRepository";
import { Location } from "@/domain/entities/Location";
import { MapboxFeature } from "@/infrastructure/mapbox/MapboxFeature";


export class MapboxLocationRepository implements LocationRepository {
  async search(query: string): Promise<Location[]> {
    const res = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?place=${query}&access_token=${process.env.MAPBOX_TOKEN}`
      );
    
      const data = await res.json();
    
      const locations: Location[] = data.features.map((f: MapboxFeature) => ({
        id: f.id,
        name: f.properties?.name,
        country: f.properties?.context?.country?.name,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));
      return locations;
  }
}