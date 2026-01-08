export class Money {
  public readonly amount: number;
  public readonly currency: string;

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    this.amount = amount;
    this.currency = currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor must be positive');
    }
    return new Money(this.amount * factor, this.currency);
  }

  private assertSameCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error('Currencies must match');
    }
  }
}