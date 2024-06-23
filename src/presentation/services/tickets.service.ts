import fs from 'fs';
import path from 'path';
import { cloudImages, qrCodeGenerator, randomString, uuid } from '../../config';
import { EventModel, TicketModel } from '../../data';
import {
  CreateTicketDto,
  PaginationDto,
  UpdateTicketDto,
} from '../../domain/dtos';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import { CustomError } from '../../domain/errors';
import { FileUploadService } from './file-upload.service';
import { ScanTicketDto } from '../../domain/dtos/tickets/scan-ticket';

export class TicketsService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  public async postTicket(createTicketDto: CreateTicketDto, userID: string) {
    const { event, phone } = createTicketDto;
    const eventExits = await EventModel.findById(event);

    if (!eventExits) {
      throw CustomError.notFound(`Evento con id ${event} no existe`);
    }

    const ticketPhoneExist = await TicketModel.findOne({ phone });

    if (ticketPhoneExist) {
      throw CustomError.badRequest(`El número ${phone} ya esta registrado`);
    }

    const keyPass = randomString.generateRandomString(5);
    const createTicketData = {
      ...createTicketDto,
      keyPass,
      user: userID,
      qrCode: '',
    };

    const ticket = new TicketModel({ ...createTicketData });
    const nameQrCode = uuid.v4() + '.png';
    const contentQrCode = {
      id: ticket.id,
      ticketName: ticket.name,
    };
    const qrCode = await qrCodeGenerator.generateQrCode(
      contentQrCode,
      nameQrCode
    );
    const qrCodeUrl = await this.fileUploadService.uploadCode(
      qrCode,
      `/abrasa/tickets/${event}`
    );

    ticket.qrCode = qrCodeUrl;
    await ticket.save();

    const ticketEntity = TicketEntity.fromObject(ticket);
    fs.unlinkSync(path.join(__dirname, '../../../', nameQrCode));
    return ticketEntity;
  }

  public async getTicket(ticketID: string) {
    const ticket = await TicketModel.findById(ticketID);

    if (!ticket) {
      throw CustomError.notFound(`No existe boleto con id ${ticketID}`);
    }

    const ticketEntity = TicketEntity.fromObject(ticket);

    return ticketEntity;
  }

  public async getTicketByKeyPass(keyPass: string) {
    const ticket = await TicketModel.findOne({ keyPass });

    if (!ticket) {
      throw CustomError.notFound(`No existe boleto con clave ${keyPass}`);
    }

    const ticketEntity = TicketEntity.fromObject(ticket);

    return ticketEntity;
  }

  public async getTicketsByEvent(
    paginationDto: PaginationDto,
    eventID: string
  ) {
    const eventExits = await EventModel.findById(eventID);

    if (!eventExits) {
      throw CustomError.notFound(`Evento con id ${eventID} no existe`);
    }

    const { page, limit } = paginationDto;
    
    const allTicketsOfEvent = await TicketModel.find({ event: eventID });
    
    const ticketsOfEvent = await TicketModel.find({ event: eventID })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(ticketsOfEvent)

    // const ticketsEntity = ticketsOfEvent.map(TicketEntity.fromObject);

    const adultsQuantity = allTicketsOfEvent.reduce(
      (acc, ticket) => acc + ticket.adultsQuantity,
      0
    );
    const kidsQuantity = allTicketsOfEvent.reduce(
      (acc, ticket) => acc + ticket.kidsQuantity,
      0
    );

    return {
      total: allTicketsOfEvent.length,
      adultsQuantity,
      kidsQuantity,
      page: page,
      limit: limit,
      tickets: ticketsOfEvent,
    };
  }

  public async deleteTicketById(ticketID: any) {
    const ticketDeleted = await TicketModel.findOneAndDelete({ _id: ticketID });

    if (!ticketDeleted) {
      throw CustomError.notFound(`El boleto con id ${ticketID} no existe`);
    }

    const ticketIDtoDelete = ticketDeleted.qrCode
      ?.split('/')
      .at(-1)
      ?.split('.')[0];
    const filePathToDelete = `abrasa/tickets/${ticketDeleted.event}/${ticketIDtoDelete}`;
    const imageWasDeleted = await cloudImages.destroyImage(filePathToDelete);

    if (!imageWasDeleted) {
      throw CustomError.internalServerError(
        `Image of ticket ${ticketID} not deleted`
      );
    }

    return { msg: 'Boleto eliminado correctamente' };
  }

  public async updateTicketById(
    updateTicketDto: UpdateTicketDto,
    ticketID: string
  ) {
    const ticketUpdated = await TicketModel.findOneAndUpdate(
      { _id: ticketID },
      { ...updateTicketDto },
      { new: true, runValidators: true }
    );

    if (!ticketUpdated) {
      throw CustomError.notFound(`El boleto con id ${ticketID} no existe`);
    }

    return { msg: 'Boleto actualizado correctamente' };
  }

  public async scanTicket(scanTicketDto: ScanTicketDto, ticketID: string) {
    const ticketScanned = await TicketModel.findById(ticketID);

    if (!ticketScanned) {
      throw CustomError.notFound(`El bolet con id ${ticketID} no existe`);
    }

    const { adultsDiscount, kidsDiscount } = scanTicketDto;

    if (
      ticketScanned.adultsQuantity === 0 &&
      ticketScanned.kidsQuantity === 0
    ) {
      throw CustomError.badRequest('El boleto ya ha agotado sus entradas');
    }

    if (adultsDiscount > ticketScanned.adultsQuantity) {
      throw CustomError.badRequest(
        'La cantidad de adultos a descontar es mayor que la cantidad registrada en base de datos'
      );
    }

    if (kidsDiscount > ticketScanned.kidsQuantity) {
      throw CustomError.badRequest(
        'La cantidad de niños a descontar es mayor que la cantidad registrada en base de datos'
      );
    }

    ticketScanned.adultsQuantity -= adultsDiscount;
    ticketScanned.kidsQuantity -= kidsDiscount;
    await ticketScanned.save();

    const ticketEntity = TicketEntity.fromObject(ticketScanned);

    return {
      msg: 'Niños y adultos actualizados correctamente',
      ticket: ticketEntity,
    };
  }

  public async deleteTicketsOfEvent(eventID: string) {
    const ticketsOfEvent = await TicketModel.find({ event: eventID });

    if (!ticketsOfEvent) {
      throw CustomError.notFound(`El evento con id ${eventID} no existe`);
    }

    ticketsOfEvent.forEach(async (ticket) => {
      await this.deleteTicketById(ticket._id);
    });

    return { msg: 'Los boletos han sido eliminados' };
  }
}
