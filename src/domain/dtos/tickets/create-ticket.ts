export class CreateTicketDto {
  private constructor(
    public readonly name: string,
    public readonly event: string,
    public readonly phone: string,
    public readonly adultsQuantity?: number,
    public readonly kidsQuantity?: number
  ) {}

  public static create(obj: {
    [key: string]: any;
  }): [string?, CreateTicketDto?] {
    const { name, event, phone, adultsQuantity = 0, kidsQuantity = 0 } = obj;

    if (!name) return ['Missing name ticket', undefined];
    if (!phone) return ['Missing phone ticket', undefined];
    if (!event) return ['Missing event id', undefined];

    return [
      undefined,
      new CreateTicketDto(name, event, phone, adultsQuantity, kidsQuantity),
    ];
  }
}
