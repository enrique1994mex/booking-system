export interface BookingPreviewVM {
  roomId: string;

  accommodation: {
    id: string;
    name: string;
    city: string;
    country: string;
  };

  room: {
    type: string;
    capacity: number;
    pricePerNight: number;
  };

  stay: {
    from: string;
    to: string;
    nights: number;
    totalPrice: number;
  };
}
