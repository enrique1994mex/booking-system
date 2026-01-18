import { AccommodationSearchResult } from "../../domain/use-cases/dto/AccommodationSearchResult"; 
import { AccommodationSearchCardVM } from "../models/AccommodationSearchCardVM";

export function mapSearchResultToCardVM(
  dto: AccommodationSearchResult
): AccommodationSearchCardVM {
  return {
    id: dto.id,
    title: dto.name,
    location: dto.location,
    priceLabel: `$${dto.priceFrom.toFixed(2)} per night`,
    imageUrl: `/images/hotel_1.jpg`,
  };
}
