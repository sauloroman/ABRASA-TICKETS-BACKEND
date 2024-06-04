export class CreateEventDto {

  private constructor(
    public readonly name: string,
    public readonly client: string,
    public readonly eventType: string,
    public readonly eventDate: string,
    public readonly createdBy: string,
  ) {}

  public static create( obj: {[key: string]: any} ): [ string?, CreateEventDto? ] {

    const { name, client, eventType, eventDate, createdBy } = obj;

    if ( !name ) return [ 'Missing name', undefined ];
    if ( !client ) return [ 'Missing client', undefined ];
    if ( !eventType ) return [ 'Missing eventType', undefined ];
    if ( !['graduación', 'posada', 'boda', 'xv', 'coffee talks', 'otro'].includes(eventType) ) return [ 'Invalid eventType', undefined ];
    if ( !eventDate ) return [ 'Missing eventDate', undefined ];
    if ( !createdBy ) return [ 'Missing createdBy', undefined ];

    return [ undefined, new CreateEventDto( name, client, eventType, eventDate, createdBy ) ]

  }

}