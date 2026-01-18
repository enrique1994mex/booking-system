export interface AccommodationCardVM {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
  };
  description: string;
  imageUrl: string;
  rooms: {
      id: string;
      type: string;
      capacity: number;
      pricePerNight: number;
  }[];
}