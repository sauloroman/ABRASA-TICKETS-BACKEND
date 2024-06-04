import { Router } from "express";
import { ProfileController } from "./profile.controller";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProfileService } from "../services/profile.service";
import { MongoMiddleware } from "../middlewares/mongo.middleware";
import { TypeMiddleware } from '../middlewares/type.middleware';
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';

export class ProfileRoutes {

  public static get routes(): Router {

    const router = Router();

    const fileUploadService = new FileUploadService();
    const profileService = new ProfileService( fileUploadService );
    const profileController = new ProfileController( profileService );

    router.use([ AuthMiddleware.validateJWT ]);

    router.get('/', profileController.getAllProfiles );
    router.get('/:id', [ MongoMiddleware.isMongoId ], profileController.getProfileById );
    router.put('/:id', [ MongoMiddleware.isMongoId ], profileController.updateProfileById );
    
    router.put('/upload/:type/:id', [
      MongoMiddleware.isMongoId,
      FileUploadMiddleware.containFiles,
      TypeMiddleware.validTypes(['image', 'coverImage'])
    ], profileController.uploadProfileImagesCloud )

    return router;

  }

}