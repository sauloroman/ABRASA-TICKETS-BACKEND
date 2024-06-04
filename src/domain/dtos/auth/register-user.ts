import { regularExps } from '../../../config';

export class RegisterUserDto {

  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  public static create( obj: {[ key: string ]: any} ): [ string?, RegisterUserDto? ] {

    const { name, email, password } = obj;

    if ( !name ) return [ 'Missing name', undefined ];
    if ( !email ) return ['Missing email', undefined ];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid', undefined];
    if ( !password ) return ['Missing password', undefined ];
    if ( password.length < 8 ) return ['Password is too short. At least 8 characters', undefined ];

    return [ undefined, new RegisterUserDto( name, email, password ) ];

  }

}