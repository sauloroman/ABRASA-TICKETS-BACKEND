import { Request, Response } from 'express';
import { CreateOpenConfirmationDto, PaginationDto } from '../../domain/dtos';
import { CustomError } from '../../domain/errors';
import { OpenConfirmationsService } from '../services/open-confirmations.service';

export class OpenConfirmationsController {

  constructor(
    private readonly openConfirmationsService: OpenConfirmationsService
  ) {}

  private handleErrorResponse = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  public createOpenConfirmation = (req: Request, res: Response) => {
    const [errorMessage, createOpenConfirmationDto] = CreateOpenConfirmationDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    this.openConfirmationsService
      .createOpenConfirmation(createOpenConfirmationDto!)
      .then((response) => res.status(201).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public getOpenConfirmationsByEvent = (req: Request, res: Response) => {
    const eventId = req.params.eventId || req.params.id;
    const { page = 1, limit = 10, name } = req.query;
    const [errorMessage, paginationDto] = PaginationDto.create(+page, +limit);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    this.openConfirmationsService
      .getOpenConfirmationsByEvent(eventId, paginationDto!, name as string)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public getOpenConfirmationById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.openConfirmationsService
      .getOpenConfirmationById(id)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public deleteOpenConfirmation = (req: Request, res: Response) => {
    const { id } = req.params;

    this.openConfirmationsService
      .deleteOpenConfirmationById(id)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public getOpenConfirmationStats = (req: Request, res: Response) => {
    const eventId = req.params.eventId || req.params.id;

    this.openConfirmationsService
      .getConfirmationStats(eventId)
      .then((response) => res.status(200).json(response))
      .catch((error) => this.handleErrorResponse(error, res));
  };

  public exportConfirmationsPdf = (req: Request, res: Response) => {
    const eventId = req.params.eventId || req.params.id;

    this.openConfirmationsService
      .generateConfirmationsPdf(eventId, res)
      .catch((error) => this.handleErrorResponse(error, res));
  };

}
