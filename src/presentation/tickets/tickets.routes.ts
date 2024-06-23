import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TicketsController } from './tickets.controller';
import { TicketsService } from '../services/tickets.service';
import { MongoMiddleware } from '../middlewares/mongo.middleware';
import { FileUploadService } from '../services/file-upload.service';

export class TicketsRoutes {
  public static get routes(): Router {
    const router = Router();

    const fileUploadService = new FileUploadService();
    const ticketsService = new TicketsService(fileUploadService);
    const ticketsController = new TicketsController(ticketsService);

    router.get('/', ticketsController.getAllTickets )

    router.post(
      '/',
      [AuthMiddleware.validateJWT],
      ticketsController.createTicket
    );
    router.get('/keyPass/:keyPass', ticketsController.getTicketKeyPass);
    router.delete(
      '/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId],
      ticketsController.deleteTicket
    );
    router.put(
      '/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId],
      ticketsController.updateTicket
    );
    router.get(
      '/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId],
      ticketsController.getTicketById
    );
    router.put(
      '/scan/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId],
      ticketsController.scanTicket
    );
    router.get(
      '/event/:id',
      [MongoMiddleware.isMongoId],
      ticketsController.getTicketsOfEvent
    );
    router.delete(
      '/event/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId],
      ticketsController.deleteAllTicketsEvent
    );

    return router;
  }
}
