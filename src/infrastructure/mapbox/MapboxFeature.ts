export interface MapboxFeature {
  id: string;
  properties?: {
    name?: string;
    context?: {
      country?: {
        name?: string;
      };
    };
  };
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
}