import { Request, Response } from "express";
import { CustomError } from "../../domain/errors";
import { ProfileService } from "../services/profile.service";
import { PaginationDto } from "../../domain/dtos";
import { UploadedFile } from "express-fileupload";

export class ProfileController {

  constructor(
    private readonly profileService: ProfileService,
  ){}

  private handleErrorResponse = ( error: unknown, res: Response ) => {

    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error'});

  }

  public getAllProfiles = ( req: Request, res: Response ) => {

    const { page = 1, limit = 5 } = req.query;
    const [ errorMessage, paginationDto ] = PaginationDto.create( +page, +limit );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage })
    }

    this.profileService.getAllProfiles( paginationDto! )
      .then( response => res.status(200).json( response ))
      .catch( error => this.handleErrorResponse( error, res ) )

  }

  public getProfileById = ( req: Request, res: Response ) => {
  
    const { id } = req.params;

    this.profileService.getProfileById( id ) 
      .then( profile => res.status(200).json( profile ) )
      .catch( error => this.handleErrorResponse( error, res ) );

  }

  public updateProfileById = ( req: Request, res: Response ) => {

    const { id } = req.params;
    const { isActive, user, ...restProfileBody } = req.body;

    this.profileService.updateProfileById( id, restProfileBody )
      .then( profileUpdated => res.status(200).json( profileUpdated ) )
      .catch( error => this.handleErrorResponse( error, res ) );

  }

  public uploadProfileImages = ( req: Request, res: Response ) => {

    const { id, type } = req.params;
    const { files } = req.body;
    const file = files.at(0) as UploadedFile;

    this.profileService.uploadProfileImages( file, id, type )
      .then( response => res.status(200).json( response ))
      .catch( error => this.handleErrorResponse( error, res ) );

  }

  public uploadProfileImagesCloud = ( req: Request, res: Response ) => {

    const { id, type } = req.params;
    const { files } = req.body;
    const file = files.at(0) as UploadedFile;

    this.profileService.uploadProfileImagesCloud( file, id, type )
      .then( response => res.status(200).json( response ))
      .catch( error => this.handleErrorResponse( error, res ) );

  }

}