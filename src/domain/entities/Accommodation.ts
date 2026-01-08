export interface Accommodation {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
  };
  description: string;
  geo?: {
    latitude: number;
    longitude: number;
  }
}