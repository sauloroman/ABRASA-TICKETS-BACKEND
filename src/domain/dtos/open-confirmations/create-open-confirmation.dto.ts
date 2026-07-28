export class CreateOpenConfirmationDto {

  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly event: string,
    public readonly adultsQuantity: number,
    public readonly kidsQuantity: number,
    public readonly willAttend: boolean,
  ) {}

  public static create(object: { [key: string]: any }): [string?, CreateOpenConfirmationDto?] {
    const {
      firstName,
      lastName,
      phone,
      event,
      adultsQuantity = 1,
      kidsQuantity = 0,
      willAttend,
    } = object;

    if (!firstName) return ['Missing firstName', undefined];
    if (!lastName) return ['Missing lastName', undefined];
    if (!phone) return ['Missing phone', undefined];
    if (!event) return ['Missing event ID', undefined];
    if (willAttend === undefined || willAttend === null) return ['Missing willAttend', undefined];

    if (isNaN(Number(adultsQuantity)) || Number(adultsQuantity) < 0) {
      return ['adultsQuantity must be a valid non-negative number', undefined];
    }

    if (isNaN(Number(kidsQuantity)) || Number(kidsQuantity) < 0) {
      return ['kidsQuantity must be a valid non-negative number', undefined];
    }

    return [
      undefined,
      new CreateOpenConfirmationDto(
        firstName,
        lastName,
        phone,
        event,
        Number(adultsQuantity),
        Number(kidsQuantity),
        Boolean(willAttend),
      ),
    ];
  }

}
