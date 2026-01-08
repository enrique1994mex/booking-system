export class DateRange {
  public readonly startDate: Date;
  public readonly endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }

    this.startDate = startDate;
    this.endDate = endDate;
  }

  get numberOfNights(): number {
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  overlaps(other: DateRange): boolean {
    return this.startDate < other.endDate && this.endDate > other.startDate;
  }
}