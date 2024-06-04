import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { EventModel, TicketModel } from '../../data';
import {
  CreateEventDto,
  PaginationDto,
  UpdateEventDto,
} from '../../domain/dtos';
import { EventEntity } from '../../domain/entities';
import { CustomError } from '../../domain/errors';
import { FileUploadService } from './file-upload.service';
import { cloudImages } from '../../config';

export class EventsService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  public async postEvent(createEventDto: CreateEventDto) {
    const newEvent = new EventModel(createEventDto);
    await newEvent.save();

    const event = EventEntity.fromObject(newEvent);

    return event;
  }

  public async getEventById(eventID: string) {
    const event = await EventModel.findById(eventID);

    if (!event) throw CustomError.notFound('El evento no existe');

    const eventEntity = EventEntity.fromObject(event);

    return eventEntity;
  }

  public async getEventsOfUser(
    userID: string,
    category: string,
    paginationDto: PaginationDto
  ) {
    const { page, limit } = paginationDto;

    let events: any = [];

    if (category === 'todos') {
      events = await EventModel.find({ createdBy: userID })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      events = await EventModel.find({
        createdBy: userID,
        $and: [{ eventType: category }],
      })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    const total = await EventModel.find({ createdBy: userID });

    const userEvents = events.map(EventEntity.fromObject);

    return {
      page: page,
      limit: limit,
      total: total.length,
      next: `/api/events?page=${page + 1}&limit=${limit}`,
      prev: page - 1 > 0 ? `/api/events?page=${page - 1}&limit=${limit}` : null,
      events: userEvents,
    };
  }

  public async deleteEventById(eventID: string) {
    const eventDeleted = await EventModel.findOneAndDelete({ _id: eventID });

    if (!eventDeleted) {
      throw CustomError.notFound(`Event with id ${eventID} does not exist`);
    }

    if (eventDeleted.image) {
      const imageID = eventDeleted.image?.split('/').at(-1)?.split('.')[0];
      const filePathToDelete = `abrasa/events/${eventID}/${imageID}`;

      const imageWasDeleted = await cloudImages.destroyImage(filePathToDelete);

      if (!imageWasDeleted) {
        throw CustomError.internalServerError(
          `Image of event ${eventID} was not deleted`
        );
      }

      await cloudImages.deleteFolder(`abrasa/events/${eventID}`);
    }

    const ticketsOfEvent = await TicketModel.find({ event: eventID });

    // ELIMINAR IMAGENES DE CLOUDINARY
    ticketsOfEvent.forEach(async ({ qrCode }) => {
      const qrCodeId = qrCode?.split('/').at(-1)?.split('.')[0];
      const qrCodePath = `abrasa/tickets/${eventID}/${qrCodeId}`;
      await cloudImages.destroyImage(qrCodePath);
    });

    await cloudImages.deleteFolder(`abrasa/tickets/${eventID}`);
    await TicketModel.deleteMany({ event: eventID });

    return { msg: 'Evento eliminado exitosamente' };
  }

  public async updateEventById(
    eventID: string,
    updateEventDto: UpdateEventDto
  ) {
    const eventUpdated = await EventModel.findOneAndUpdate(
      { _id: eventID },
      { ...updateEventDto },
      { new: true, runValidators: true }
    );

    if (!eventUpdated) {
      throw CustomError.notFound(`Event with id ${eventID} does not exist`);
    }

    const eventUpdatedEntity = EventEntity.fromObject(eventUpdated);

    return eventUpdatedEntity;
  }

  public async updateEventPhotoServer(file: UploadedFile, id: string) {
    const event = await EventModel.findById(id);

    if (!event) {
      throw CustomError.notFound(`Event with id ${id} not found`);
    }

    const fileName = await this.fileUploadService.uploadFileServer(
      file,
      `uploads/events/${id}`
    );

    if (!fileName) {
      throw CustomError.internalServerError('File was not saved');
    }

    if (event.image) {
      const filePath = path.join(
        __dirname,
        `../../uploads/events/${id}`,
        event.image
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    event.image = fileName;
    await event.save();

    const eventEntity = EventEntity.fromObject(event);

    return eventEntity;
  }

  public async updateEventPhotoCloud(file: UploadedFile, id: string) {
    const event = await EventModel.findById(id);

    if (!event) {
      throw CustomError.notFound(`Event with id ${id} not found`);
    }

    const fileName = await this.fileUploadService.uploadFileCloud(
      file,
      `abrasa/events/${id}`
    );

    if (!fileName) {
      throw CustomError.internalServerError('File was not saved');
    }

    if (event.image) {
      const imageID = event.image?.split('/').at(-1)?.split('.')[0];
      await this.fileUploadService.destroyImageCloud(
        `abrasa/events/${id}/${imageID}`
      );
    }

    event.image = fileName;
    await event.save();

    const eventEntity = EventEntity.fromObject(event);

    return eventEntity;
  }
}
