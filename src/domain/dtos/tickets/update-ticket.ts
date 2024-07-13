export class UpdateTicketDto {

  private constructor(
    public readonly name?: string,
    public readonly phone?: string,
    public readonly adultsQuantity?: number,
    public readonly kidsQuantity?: number,
    public table?: number,
    public keyPass?: number,
  ){}

  public static create( obj: {[key: string]: any} ): [ string?, UpdateTicketDto? ] {

    const { name, phone, adultsQuantity, kidsQuantity, table, keyPass, } = obj;

    if ( adultsQuantity < 0 || kidsQuantity < 0 ) return ['La cantidad de niños y adultos debe de ser mayor que 0', undefined];
    if ( keyPass.length < 4 ) return ['La clave debe ser igual o mayor que 4 letras', undefined];

    return [ undefined, new UpdateTicketDto( name, phone, adultsQuantity, kidsQuantity, table, keyPass ) ]

  }

}