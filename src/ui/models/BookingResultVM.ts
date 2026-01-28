export interface BookingResultVM {
  bookingId: string;
  status: string;
  accommodation: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
  room: {
    id: string;
    type: string;
    capacity: number;
    pricePerNight: number;
  };
  stay: {
    from: string;
    to: string;
    nights: number;
    totalPrice: number;
    currency: string;
  };
  userId: string;
}
