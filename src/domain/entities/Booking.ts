import { DateRange } from "../value-objects/DateRange";
import { Money } from "../value-objects/Money";

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  dateRange: DateRange;
  totalPrice: Money;
  status: BookingStatus;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}