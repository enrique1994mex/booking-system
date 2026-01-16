import { AccommodationSearchResult } from "../../domain/use-cases/dto/AccommodationSearchResult"; 
import { AccommodationCardVM } from "../models/AccommodationCardVM";

export function mapSearchResultToCardVM(
  dto: AccommodationSearchResult
): AccommodationCardVM {
  return {
    id: dto.id,
    title: dto.name,
    location: dto.location,
    priceLabel: `$${dto.priceFrom.toFixed(2)} per night`,
    imageUrl: `/images/hotel_1.jpg`,
  };
}
