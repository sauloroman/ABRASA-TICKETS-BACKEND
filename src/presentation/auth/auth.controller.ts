import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { 
  LoginGoogleDto, 
  LoginUserDto, 
  PasswordChangeDto, 
  PasswordEmailDto, 
  RegisterUserDto, 
  ValidateCodeDto } from '../../domain/dtos';
import { CustomError } from "../../domain/errors";

export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ){}

  private handleErrorResponse = ( error: unknown, res: Response ) => {

    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error'});

  }

  public registerUser = (req: Request, res: Response ) => {
  
    const [ errorMessage, registerUserDto ] = RegisterUserDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.authService.registerUser( registerUserDto! )
      .then( user => res.status(201).json( user ) )
      .catch( error => this.handleErrorResponse( error, res ) );

  }
  
  public loginUser = ( req: Request, res: Response ) => {
    
    const [ errorMessage, loginUserDto ] = LoginUserDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.authService.loginUser( loginUserDto! )
      .then( user => res.status(200).json( user ) )
      .catch( error => this.handleErrorResponse( error, res ) );

  }

  public renovateToken = ( req: Request, res: Response ) => {
  
    const { user } = req.body;

    this.authService.renewToken( user! )
      .then( token => res.status(200).json({ user, token }))
      .catch( error => this.handleErrorResponse( error, res ) );

  }

  public validateCode = ( req: Request, res: Response ) => {

    const { token } = req.params;
    const [ errorMessage, validateCodeDto ] = ValidateCodeDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.authService.validateCode( validateCodeDto!, token )
      .then( user => res.status(200).json( user ) )
      .catch( error => this.handleErrorResponse( error, res ));

  } 

  public googleSignIn = ( req: Request, res: Response ) => {
    
    const [ errorMessage, loginGoogleDto ] = LoginGoogleDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.authService.googleSingIn( loginGoogleDto! )
      .then( user => res.status(200).json( user ) )
      .catch( error => this.handleErrorResponse( error, res ));

  }

  public changePasswordEmail = ( req: Request, res: Response ) => {

    const [ errorMessage, passwordEmailDto ] = PasswordEmailDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.authService.changePasswordEmail( passwordEmailDto! )
      .then( ( response ) => res.status(200).json( response ) )
      .catch( error => this.handleErrorResponse( error, res ));

  }

  public changePassword = ( req: Request, res: Response ) => {

    const { token } = req.params;
    const [ errorMessage, passwordChangeDto ] = PasswordChangeDto.create( req.body );

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage });
    }

    this.authService.changePassword( passwordChangeDto!, token )
      .then( response => res.status(200).json( response ) )
      .catch( error => this.handleErrorResponse( error, res ) )

  }

}