import { Request, Response } from "express";
import { EventsService } from "../services/events.service";
import { CreateEventDto, PaginationDto, UpdateEventDto } from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import { UploadedFile } from "express-fileupload";

export class EventsController {

  constructor(
    private readonly eventsService: EventsService
  ){}

  private handleError = ( error: unknown, res: Response ) => {

    if ( error instanceof CustomError ) {
      res.status( error.statusCode ).json({ error: error.message});
    }

    console.log(`${error}`);
    res.status(500).json({ error: 'Internal Server Error'});

  }

  public createEvent = ( req: Request, res: Response ) => {

    const { id } = req.body.user;
    const [ errorMessage, createEventDto ] = CreateEventDto.create( { ...req.body, createdBy: id } );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.eventsService.postEvent( createEventDto! )
      .then( response => res.status(201).json( response ) )
      .catch( error => this.handleError( error, res ) )

  } 
  
  public getEventsOfUser = ( req: Request, res: Response ) => {

    const { page = 1, limit = 6, category = 'todos' } = req.query;
    const { id: userID } = req.params;

    const [ errorMessage, paginationDto ] = PaginationDto.create( +page, +limit );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.eventsService.getEventsOfUser( userID, category as string, paginationDto! )
      .then( response => res.status(200).json( response ) )
      .catch( error => this.handleError( error, res ) );

  }

  public getEventById = ( req: Request, res: Response ) => {

    const { id: eventID } = req.params;

    this.eventsService.getEventById( eventID )
      .then( response => res.status(200).json( response ) )
      .catch( error => this.handleError( error, res ) );

  }

  public deleteEventById = ( req: Request, res: Response ) => {

    const { id: eventID } = req.params;

    this.eventsService.deleteEventById( eventID )  
      .then( response => res.status(200).json( response ))
      .catch( error => this.handleError( error, res ) );

  }

  public updateEventById = ( req: Request, res: Response ) => {

    const { id: eventID } = req.params;
    const [ errorMessage, updateEventDto ] = UpdateEventDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }
    
    this.eventsService.updateEventById( eventID, updateEventDto! ) 
      .then( response => res.status(200).json( response ) )
      .catch( error => this.handleError( error, res ) );

  }

  public uploadEventPhotoServer = ( req: Request, res: Response ) => {

    const { id: eventID } = req.params;
    const { files } = req.body;
    const file = files.at(0) as UploadedFile;

    this.eventsService.updateEventPhotoServer( file, eventID )
      .then( response => res.status(200).json( response ) )
      .catch( error => this.handleError( error, res ))

  }

  public uploadEventPhotoCloud = ( req: Request, res: Response ) => {

    const { id: eventID } = req.params;
    const { files } = req.body;
    const file = files.at(0) as UploadedFile;

    this.eventsService.updateEventPhotoCloud( file, eventID )
      .then( response => res.status(200).json( response ) )
      .catch( error => this.handleError( error, res ))

  }
 
}