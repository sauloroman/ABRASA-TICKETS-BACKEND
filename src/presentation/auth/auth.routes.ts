import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "../services/email.service";
import { envs } from '../../config';
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRouter {

  public static get routes(): Router {

    const router = Router();

    const emailService = new EmailService({
      mailerService: envs.MAILER_SERVICE,
      mailerEmail: envs.MAILER_EMAIL,
      postToProvider: envs.SEND_EMAIL,
      senderEmailPassword: envs.MAILER_SECRET_KEY,
    })

    const authService = new AuthService( emailService );
    const authController = new AuthController( authService );
    
    router.get('/renew-token', [AuthMiddleware.validateJWT], authController.renovateToken );
    router.post('/login', authController.loginUser );
    router.post('/google',authController.googleSignIn )
    router.post('/register', authController.registerUser );
    router.put('/validate-email/:token', authController.validateCode );
    
    router.post('/change-password-email', authController.changePasswordEmail );
    router.put('/change-password/:token', authController.changePassword );

    return router;
  } 

}