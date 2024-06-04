import { regularExps } from '../../../config/utils/regular-exp';

export class PasswordEmailDto {

  private constructor(
    public readonly email: string,
  ){}

  public static create( obj: {[key: string]: any} ): [ string?, PasswordEmailDto? ] {

    const { email } = obj;

    if ( !email ) return ['Missing email', undefined];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid', undefined ];

    return [ undefined, new PasswordEmailDto( email ) ];

  }

}