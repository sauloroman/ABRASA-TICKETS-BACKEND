import { CustomError } from "../errors";

export class TicketEntity {

  constructor(
    public id: string,
    public name: string,
    public adultsQuantity: number,
    public adultsCounter: number,
    public kidsQuantity: number,
    public kidsCounter: number,
    public qrCode: string,
    public phone: string,
    public keyPass: string,
    public isActive: boolean,
    public event: string,
    public user: string,
    public table: number,
  ){}

  public static fromObject( ticketObj: {[key: string]: any}): TicketEntity {

    const {
      id, _id,
      name,
      adultsQuantity,
      adultsCounter,
      kidsQuantity,
      kidsCounter,
      qrCode = '',
      phone,
      keyPass,
      isActive,
      event,
      user,
      table,
    } = ticketObj;

    if ( !id && !_id ) throw CustomError.badRequest('Missing id');
    if ( !name ) throw CustomError.badRequest('Missing name');
    if ( !keyPass ) throw CustomError.badRequest('Missing key pass');
    if ( !phone ) throw CustomError.badRequest('Missing phone');
    if ( isActive === undefined ) throw CustomError.badRequest('Missing isActive');
    if ( !event ) throw CustomError.badRequest('Missing Event');
    if ( !user ) throw CustomError.badRequest('Missing User');
    
    return new TicketEntity(
      id,
      name,
      adultsQuantity,
      adultsCounter,
      kidsQuantity,
      kidsCounter,
      qrCode,
      phone,
      keyPass,
      isActive,
      event,
      user,
      table
    );

  }

}