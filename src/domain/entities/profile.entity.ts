import { CustomError } from "../errors";

export class ProfileEntity {

  constructor(
    public id: string,
    public user: string,
    public image?: string,
    public coverImage?: string,
    public bio?: string,
    public phone?: string,
    public facebook?: string,
    public instagram?: string,
    public website?: string,
    public location?: string,
    public address?: string,
    public profession?: string,
  ){}

  public static fromObjet( profileObj: {[key: string]: any}): ProfileEntity {

    const {  
      id, 
      _id, 
      user, 
      image, 
      coverImage,
      bio = 'Sin datos', 
      phone = 'Sin datos', 
      facebook, 
      instagram, 
      website, 
      location = 'Sin datos', 
      address = 'Sin datos',
      profession = 'Sin datos'
    } = profileObj;

    if ( !id && !_id ) throw CustomError.badRequest('Missing id');
    if ( !user ) throw CustomError.badRequest('Missing user');

    return new ProfileEntity( id, user, image, coverImage, bio, phone, facebook, instagram, website, location, address, profession );

  }

}