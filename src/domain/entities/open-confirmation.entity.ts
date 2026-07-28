import { CustomError } from "../errors";

export class OpenConfirmationEntity {

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public adultsQuantity: number,
    public kidsQuantity: number,
    public willAttend: boolean,
    public registrationDate: Date,
    public event: string,
  ){}

  public static fromObject( object: {[key: string]: any}): OpenConfirmationEntity {

    const { 
      id, _id, 
      firstName, 
      lastName, 
      phone, 
      adultsQuantity = 1, 
      kidsQuantity = 0, 
      willAttend = true,
      registrationDate, 
      event 
    } = object;

    if ( !id && !_id ) throw CustomError.badRequest('Missing id');
    if ( !firstName ) throw CustomError.badRequest('Missing first name');
    if ( !lastName ) throw CustomError.badRequest('Missing last name');
    if ( !phone ) throw CustomError.badRequest('Missing phone');
    if ( !event ) throw CustomError.badRequest('Missing event');

    return new OpenConfirmationEntity(
      id || _id,
      firstName,
      lastName,
      phone,
      adultsQuantity,
      kidsQuantity,
      willAttend,
      registrationDate || new Date(),
      event,
    );

  }

}
