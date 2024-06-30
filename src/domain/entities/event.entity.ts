import { CustomError } from "../errors";

export class EventEntity {

  constructor(
    public id: string,
    public name: string,
    public eventType: string,
    public eventDate: string,
    public createdBy: string,
    public client?: string,
    public description?: string,
    public image?: string,
    public invitation?: string,
  ){}

  public static fromObject( eventObj: {[key: string]: any}): EventEntity {

    const { 
      id, _id, 
      name,
      eventType, 
      eventDate, 
      createdBy, 
      client = '',
      description = '', 
      image = '',
      invitation = '',
    } = eventObj;

    if ( !id && !_id ) throw CustomError.badRequest('Missing id');
    if ( !name ) throw CustomError.badRequest('Missing name');
    if ( !createdBy ) throw CustomError.badRequest('Missing created by');
    if ( !eventType ) throw CustomError.badRequest('Missing event type');
    if ( !eventDate ) throw CustomError.badRequest('Missing event date');
    
    return new EventEntity(
      id, 
      name,  
      eventType, 
      eventDate, 
      createdBy, 
      client, 
      description, 
      image,
      invitation,
    );

  }

}