import { CustomError } from "../errors";

export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public lastLogin: Date,
    public createdAt: Date,
    public isActive: boolean,
    public profile: string,
  ){}

  public static fromObject( userObj: {[ key: string ]: any} ): UserEntity {

    const { id, _id, name, email, emailValidated, password, lastLogin, createdAt, isActive, profile } = userObj;

    if ( !id && !_id ) throw CustomError.badRequest('Missing id'); 
    if ( !name ) throw CustomError.badRequest('Missing name');
    if ( !email ) throw CustomError.badRequest('Missing email');
    if ( emailValidated === undefined ) throw CustomError.badRequest('Missing emailValidated');
    if ( !password ) throw CustomError.badRequest('Missing password');
    if ( !lastLogin ) throw CustomError.badRequest('Missing lastLogin');
    if ( !createdAt ) throw CustomError.badRequest('Missing createdAt');
    if ( isActive === undefined ) throw CustomError.badRequest('Missing isActive');
    if ( !profile ) throw CustomError.badRequest('Missing profile');

    return new UserEntity( id, name, email, emailValidated, password, lastLogin, createdAt, isActive, profile );

  }

}