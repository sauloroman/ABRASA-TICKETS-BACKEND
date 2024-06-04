import { Router } from 'express';
import { AuthRouter } from './auth/auth.routes';
import { ProfileRoutes } from './profile/profile.routes';
import { EventsRoutes } from './events/events.routes';
import { TicketsRoutes } from './tickets/tickets.routes';

export class AppRouter {
  public static get routes(): Router {
    const router = Router();

    router.use('/api/auth', AuthRouter.routes);
    router.use('/api/profile', ProfileRoutes.routes);
    router.use('/api/events', EventsRoutes.routes);
    router.use('/api/tickets', TicketsRoutes.routes);

    return router;
  }
}
