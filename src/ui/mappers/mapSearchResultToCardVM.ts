import { AccommodationSearchResult } from "../../domain/use-cases/dto/AccommodationSearchResult";
import { AccommodationSearchCardVM } from "../models/AccommodationSearchCardVM";
import { generateRating, getRatingLabel } from "./generateRating";

export function mapSearchResultToCardVM(
  dto: AccommodationSearchResult
): AccommodationSearchCardVM {
  const { score, reviews } = generateRating(dto.id);

  return {
    id: dto.id,
    title: dto.name,
    location: dto.location,
    locationLink: "Show on map",
    priceLabel: `$ ${dto.priceFrom.toFixed(2)}`,
    priceSubtext: "per night",
    imageUrl: `/images/hotel_1.jpg`,
    ratingScore: score.toFixed(1),
    ratingLabel: getRatingLabel(score),
    reviewCount: `${reviews} reviews`,
    propertyType: "Hotel",
  };
}
