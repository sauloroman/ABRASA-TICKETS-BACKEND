import { Router } from "express";
import { EventsService } from "../services/events.service";
import { EventsController } from "./events.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { MongoMiddleware } from '../middlewares/mongo.middleware';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { FileUploadService } from "../services/file-upload.service";

export class EventsRoutes {

  public static get routes(): Router {

    const router = Router();

    const fileUploadService = new FileUploadService();
    const eventsService = new EventsService( fileUploadService );
    const eventsController = new EventsController( eventsService );

    router.get('/:id', [ AuthMiddleware.validateJWT, MongoMiddleware.isMongoId ], eventsController.getEventsOfUser );
    router.get('/event/:id', [MongoMiddleware.isMongoId], eventsController.getEventById );

    router.put('/:id', [ AuthMiddleware.validateJWT, MongoMiddleware.isMongoId], eventsController.updateEventById );

    router.put('/upload/server/:id', [
      AuthMiddleware.validateJWT,
      MongoMiddleware.isMongoId,
      FileUploadMiddleware.containFiles,
    ], eventsController.uploadEventPhotoServer );

    router.put('/upload/cloud/:id', [
      AuthMiddleware.validateJWT,
      MongoMiddleware.isMongoId,
      FileUploadMiddleware.containFiles,
    ], eventsController.uploadEventPhotoCloud );

    router.post('/', [ AuthMiddleware.validateJWT ], eventsController.createEvent );

    router.delete('/:id', [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId], eventsController.deleteEventById)

    return router;

  }

}