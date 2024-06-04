export class ScanTicketDto {
  private constructor(
    public readonly adultsDiscount: number,
    public readonly kidsDiscount: number
  ) {}

  public static create(obj: { [key: string]: any }): [string?, ScanTicketDto?] {
    const { adultsDiscount, kidsDiscount } = obj;

    if (!adultsDiscount) return ['Missing adults discount quantity', undefined];
    if (kidsDiscount === undefined)
      return ['Missing kids discount quantity', undefined];

    return [undefined, new ScanTicketDto(adultsDiscount, kidsDiscount)];
  }
}
