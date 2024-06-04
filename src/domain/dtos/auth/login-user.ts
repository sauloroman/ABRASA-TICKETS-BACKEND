import { regularExps } from '../../../config/utils/regular-exp';

export class LoginUserDto {

  private constructor(
    public email: string,
    public password: string,
  ) {}

  public static create( obj: {[ key: string ]: any} ): [ string?, LoginUserDto? ] {

    const { email, password } = obj;

    if (!email) return [ 'Missing email', undefined ]
    if (!regularExps.email.test( email ) ) return ['Email is not valid', undefined]
    if (!password ) return ['Missing Password']

    return [ undefined, new LoginUserDto( email, password ) ];
  }

}