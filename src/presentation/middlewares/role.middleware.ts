import { NextFunction, Request, Response } from "express";
import { EventModel, TicketModel, OpenConfirmationModel } from "../../data";

export class RoleMiddleware {

  public static async checkAccess(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;

    if (!user) {
      return res.status(401).json({ error: 'No autorizado - Inicie sesión' });
    }

    if (user.role === 'Admin') {
      return next();
    }

    if (user.role === 'Cliente') {
      if (req.method !== 'GET') {
        return res.status(403).json({ error: 'Acción prohibida para clientes' });
      }

      try {
        const { id, eventId, keyPass } = req.params;
        const userId = user.id;

        // 1. Consultar eventos de un usuario: GET /api/events/:id
        if (req.baseUrl.endsWith('/events') && id && !req.route.path.includes('/event/')) {
          if (id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para consultar eventos de otros usuarios' });
          }
          return next();
        }

        // 2. Detalle de evento específico: GET /api/events/event/:id
        if (req.baseUrl.endsWith('/events') && req.route.path.includes('/event/')) {
          const event = await EventModel.findById(id || eventId);
          if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
          if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acceso denegado a este evento' });
          }
          return next();
        }

        // 3. Boletos de un evento: GET /api/tickets/event/:id
        if (req.baseUrl.endsWith('/tickets') && req.route.path.includes('/event/')) {
          const event = await EventModel.findById(id || eventId);
          if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
          if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acceso denegado a los boletos de este evento' });
          }
          return next();
        }

        // 4. Boleto específico por ID: GET /api/tickets/:id
        if (req.baseUrl.endsWith('/tickets') && id && !req.route.path.includes('/event/') && !req.route.path.includes('/keyPass/')) {
          const ticket = await TicketModel.findById(id).populate('event');
          if (!ticket) return res.status(404).json({ error: 'Boleto no encontrado' });
          const event: any = ticket.event;
          if (!event || event.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acceso denegado a este boleto' });
          }
          return next();
        }

        // 5. Boleto específico por keyPass: GET /api/tickets/keyPass/:keyPass
        if (req.baseUrl.endsWith('/tickets') && keyPass) {
          const ticket = await TicketModel.findOne({ keyPass }).populate('event');
          if (!ticket) return res.status(404).json({ error: 'Boleto no encontrado' });
          const event: any = ticket.event;
          if (!event || event.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acceso denegado a este boleto' });
          }
          return next();
        }

        // 6. Confirmaciones de un evento: GET /api/open-confirmations/event/:eventId y /stats
        if (req.baseUrl.endsWith('/open-confirmations') && req.route.path.includes('/event/')) {
          const targetEventId = eventId || id;
          const event = await EventModel.findById(targetEventId);
          if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
          if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acceso denegado a las confirmaciones de este evento' });
          }
          return next();
        }

        // 7. Confirmación específica por ID: GET /api/open-confirmations/:id
        if (req.baseUrl.endsWith('/open-confirmations') && id && !req.route.path.includes('/event/')) {
          const confirmation = await OpenConfirmationModel.findById(id).populate('event');
          if (!confirmation) return res.status(404).json({ error: 'Confirmación no encontrada' });
          const event: any = confirmation.event;
          if (!event || event.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acceso denegado a esta confirmación' });
          }
          return next();
        }

        // Si es cliente y no coincide con ninguna ruta GET permitida, bloquear por defecto
        return res.status(403).json({ error: 'Acceso no autorizado para este recurso con rol Cliente' });

      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno en verificación de roles' });
      }
    }

    return next();
  }

  public static isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    if (!user) {
      return res.status(401).json({ error: 'No autorizado - Inicie sesión' });
    }
    if (user.role !== 'Admin') {
      return res.status(403).json({ error: 'Acceso denegado - Se requiere rol Admin' });
    }
    next();
  }

}
