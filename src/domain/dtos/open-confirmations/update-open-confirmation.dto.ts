export class UpdateOpenConfirmationDto {

  private constructor(
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phone?: string,
    public readonly adultsQuantity?: number,
    public readonly kidsQuantity?: number,
    public readonly willAttend?: boolean,
  ) {}

  public get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.firstName !== undefined) returnObj.firstName = this.firstName;
    if (this.lastName !== undefined) returnObj.lastName = this.lastName;
    if (this.phone !== undefined) returnObj.phone = this.phone;
    if (this.adultsQuantity !== undefined) returnObj.adultsQuantity = this.adultsQuantity;
    if (this.kidsQuantity !== undefined) returnObj.kidsQuantity = this.kidsQuantity;
    if (this.willAttend !== undefined) returnObj.willAttend = this.willAttend;

    return returnObj;
  }

  public static create(object: { [key: string]: any }): [string?, UpdateOpenConfirmationDto?] {
    const {
      firstName,
      lastName,
      phone,
      adultsQuantity,
      kidsQuantity,
      willAttend,
    } = object;

    if (adultsQuantity !== undefined && adultsQuantity !== null) {
      if (isNaN(Number(adultsQuantity)) || Number(adultsQuantity) < 0) {
        return ['adultsQuantity must be a valid non-negative number', undefined];
      }
    }

    if (kidsQuantity !== undefined && kidsQuantity !== null) {
      if (isNaN(Number(kidsQuantity)) || Number(kidsQuantity) < 0) {
        return ['kidsQuantity must be a valid non-negative number', undefined];
      }
    }

    return [
      undefined,
      new UpdateOpenConfirmationDto(
        firstName,
        lastName,
        phone,
        adultsQuantity !== undefined && adultsQuantity !== null ? Number(adultsQuantity) : undefined,
        kidsQuantity !== undefined && kidsQuantity !== null ? Number(kidsQuantity) : undefined,
        willAttend !== undefined && willAttend !== null ? Boolean(willAttend) : undefined,
      ),
    ];
  }

}
