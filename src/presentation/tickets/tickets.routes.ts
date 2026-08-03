import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TicketsController } from './tickets.controller';
import { TicketsService } from '../services/tickets.service';
import { MongoMiddleware } from '../middlewares/mongo.middleware';
import { FileUploadService } from '../services/file-upload.service';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class TicketsRoutes {
  public static get routes(): Router {
    const router = Router();

    const fileUploadService = new FileUploadService();
    const ticketsService = new TicketsService(fileUploadService);
    const ticketsController = new TicketsController(ticketsService);

    router.get('/', [AuthMiddleware.validateJWT, RoleMiddleware.checkAccess], ticketsController.getAllTickets)

    router.post(
      '/',
      [AuthMiddleware.validateJWT, RoleMiddleware.checkAccess],
      ticketsController.createTicket
    );
    router.get('/keyPass/:keyPass', ticketsController.getTicketKeyPass);
    router.delete(
      '/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess],
      ticketsController.deleteTicket
    );
    router.put(
      '/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess],
      ticketsController.updateTicket
    );
    router.get(
      '/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess],
      ticketsController.getTicketById
    );
    router.put(
      '/scan/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess],
      ticketsController.scanTicket
    );
    router.get(
      '/event/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess],
      ticketsController.getTicketsOfEvent
    );
    router.delete(
      '/event/:id',
      [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess],
      ticketsController.deleteAllTicketsEvent
    );
    router.post(
      '/bulk',
      [AuthMiddleware.validateJWT, RoleMiddleware.isAdmin],
      ticketsController.createBulkTickets
    )

    return router;
  }
}
