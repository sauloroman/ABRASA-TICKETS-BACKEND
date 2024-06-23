import { Request, Response } from 'express';
import {
  CreateTicketDto,
  PaginationDto,
  UpdateTicketDto,
} from '../../domain/dtos';
import { CustomError } from '../../domain/errors';
import { TicketsService } from '../services/tickets.service';
import { ScanTicketDto } from '../../domain/dtos/tickets/scan-ticket';

export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  private handleErrorResponse = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  public getTicketById = (req: Request, res: Response) => {
    const { id: ticketID } = req.params;

    this.ticketsService
      .getTicket(ticketID)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public getTicketKeyPass = (req: Request, res: Response) => {
    const { keyPass } = req.params;

    this.ticketsService
      .getTicketByKeyPass(keyPass)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public createTicket = (req: Request, res: Response) => {
    const { id: userID } = req.body.user;
    const [errorMessage, createTicketDto] = CreateTicketDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    this.ticketsService
      .postTicket(createTicketDto!, userID)
      .then((response) => res.status(201).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public getTicketsOfEvent = (req: Request, res: Response) => {
    const { id: eventID } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const [errorMessage, paginationDto] = PaginationDto.create(+page, +limit);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    this.ticketsService
      .getTicketsByEvent(paginationDto!, eventID)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public deleteTicket = (req: Request, res: Response) => {
    const { id: ticketID } = req.params;

    this.ticketsService
      .deleteTicketById(ticketID)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public updateTicket = (req: Request, res: Response) => {
    const { id: ticketID } = req.params;
    const [errorMessage, updateTicketDto] = UpdateTicketDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    this.ticketsService
      .updateTicketById(updateTicketDto!, ticketID)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public scanTicket = (req: Request, res: Response) => {
    const { id: ticketID } = req.params;
    const [errorMessage, scanTicketDto] = ScanTicketDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    this.ticketsService
      .scanTicket(scanTicketDto!, ticketID)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public deleteAllTicketsEvent = (req: Request, res: Response) => {
    const { id: eventID } = req.params;

    this.ticketsService
      .deleteTicketsOfEvent(eventID)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public getAllTickets = (req: Request, res: Response) => {
    this.ticketsService.getTickets()
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  }
}
