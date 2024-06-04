export class UpdateTicketDto {

  private constructor(
    public readonly name?: string,
    public readonly phone?: string,
    public readonly adultsQuantity?: number,
    public readonly kidsQuantity?: number,
  ){}

  public static create( obj: {[key: string]: any} ): [ string?, UpdateTicketDto? ] {

    const { name, phone, adultsQuantity, kidsQuantity } = obj;

    if ( adultsQuantity < 0 || kidsQuantity < 0 ) return ['Adults and kids quantity must be greater than 0', undefined];

    return [ undefined, new UpdateTicketDto( name, phone, adultsQuantity, kidsQuantity ) ]

  }

}