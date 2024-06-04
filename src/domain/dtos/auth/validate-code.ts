export class ValidateCodeDto {

  constructor(
    public readonly code: string,
  ){}

  public static create( obj: { [key: string ]: any } ): [ string?, ValidateCodeDto? ] {

    const { code } = obj;

    if ( !code ) return ['Missing code', undefined];
    if ( code.length !== 5 ) return ['Invalid code format', undefined];

    return [ undefined, new ValidateCodeDto( code ) ];

  }

} 