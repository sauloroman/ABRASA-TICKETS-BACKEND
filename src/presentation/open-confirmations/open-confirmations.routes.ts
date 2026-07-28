import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { MongoMiddleware } from '../middlewares/mongo.middleware';
import { OpenConfirmationsController } from './open-confirmations.controller';
import { OpenConfirmationsService } from '../services/open-confirmations.service';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class OpenConfirmationsRoutes {
  public static get routes(): Router {
    const router = Router();

    const openConfirmationsService = new OpenConfirmationsService();
    const controller = new OpenConfirmationsController(openConfirmationsService);

    // api/open-confirmations

    router.post('/', controller.createOpenConfirmation);
    router.get('/event/:eventId/stats', [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess], controller.getOpenConfirmationStats);
    router.get('/event/:eventId/export/pdf', [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess], controller.exportConfirmationsPdf);
    router.get('/event/:eventId', [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess], controller.getOpenConfirmationsByEvent);
    router.get('/:id', [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess], controller.getOpenConfirmationById);
    router.delete('/:id', [AuthMiddleware.validateJWT, MongoMiddleware.isMongoId, RoleMiddleware.checkAccess], controller.deleteOpenConfirmation);

    return router;
  }
}
