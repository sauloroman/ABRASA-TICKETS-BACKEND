export class UpdateEventDto {

  private constructor(
    public readonly name?: string,
    public readonly description?: string,
    public readonly client?: string,
    public readonly guestQuantity?: number,
    public readonly eventType?: string,
    public readonly eventDate?: string,
    public readonly invitation?: string,
  ){}

  public static create( obj: {[key: string]: any}): [string?, UpdateEventDto?]{

    const { name, description, client, guestQuantity, eventType, eventDate, invitation } = obj;

    if ( eventType && !['graduación', 'posada', 'xv', 'boda', 'coffee talks', 'otro'].includes(eventType) ) {
      return ['Invalid eventType', undefined];
    }

    return [ undefined, new UpdateEventDto( name, description, client, guestQuantity, eventType, eventDate, invitation ) ];

  }

}