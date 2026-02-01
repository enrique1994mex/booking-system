export interface BookingConfirmation {
  booking_id: string;
  status: string;
  user_id: string;

  accommodation_id: number;
  accommodation_name: string;
  city: string;
  country: string;

  room_id: number;
  room_type: string;
  capacity: number;
  price_per_night: number;

  from_date: string;
  to_date: string;
  nights: number;
  total_amount: number;
  currency: string;
}
