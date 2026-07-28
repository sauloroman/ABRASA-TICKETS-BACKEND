import { Router } from "express";
import { EventsService } from "../services/events.service";
import { EventsController } from "./events.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { MongoMiddleware } from '../middlewares/mongo.middleware';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { FileUploadService } from "../services/file-upload.service";
import { RoleMiddleware } from "../middlewares/role.middleware";

export class EventsRoutes {

  public static get routes(): Router {

    const router = Router();

    const fileUploadService = new FileUploadService();
    const eventsService = new EventsService( fileUploadService );
    const eventsController = new EventsController( eventsService );

    router.get('/:id', [ AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess ], eventsController.getEventsOfUser );
    router.get('/event/:id', [ AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess ], eventsController.getEventById );

    router.put('/:id', [ AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess ], eventsController.updateEventById );

    router.put('/upload/server/:id', [
      AuthMiddleware.validateJWT,
      MongoMiddleware.isMongoId,
      FileUploadMiddleware.containFiles,
      RoleMiddleware.checkAccess,
    ], eventsController.uploadEventPhotoServer );

    router.put('/upload/cloud/:id', [
      AuthMiddleware.validateJWT,
      MongoMiddleware.isMongoId,
      FileUploadMiddleware.containFiles,
      RoleMiddleware.checkAccess,
    ], eventsController.uploadEventPhotoCloud );

    router.post('/', [ AuthMiddleware.validateJWT, RoleMiddleware.checkAccess ], eventsController.createEvent );

    router.delete('/:id', [ AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess ], eventsController.deleteEventById)

    return router;

  }

}