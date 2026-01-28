export interface BookingResultVM {
  id: string;
  status: string;
  roomId: string;
  userId: string;
  from: string;
  to: string;
  totalPrice: number;
  currency: string;
}
