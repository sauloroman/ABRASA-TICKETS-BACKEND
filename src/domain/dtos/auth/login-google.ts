export class LoginGoogleDto {

  private constructor(
    public idToken: string,
  ) {}

  public static create( obj: {[key: string]: any} ): [ string?, LoginGoogleDto? ] {

    const { idToken } = obj;

    if ( !idToken ) return ['Missing id_token', undefined ];

    return [ undefined, new LoginGoogleDto( idToken ) ];

  }

}