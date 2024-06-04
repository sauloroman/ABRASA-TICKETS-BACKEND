export class PasswordChangeDto {

  private constructor(
    public readonly newPassword: string,
  ){}

  public static create( obj: {[key: string]: any}) : [ string?, PasswordChangeDto? ] {

    const { newPassword } = obj;

    if ( !newPassword ) return ['Missing new password', undefined ];
    if ( newPassword.length < 8 ) return ['Invalid Password', undefined ];

    return [ undefined, new PasswordChangeDto( newPassword ) ]
  }

}