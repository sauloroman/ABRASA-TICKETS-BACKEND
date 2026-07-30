import { Response } from 'express';
import puppeteer from 'puppeteer';
import { EventModel, OpenConfirmationModel } from '../../data';
import { CreateOpenConfirmationDto, PaginationDto, UpdateOpenConfirmationDto } from '../../domain/dtos';
import { OpenConfirmationEntity } from '../../domain/entities';
import { CustomError } from '../../domain/errors';
import { generateConfirmationsHtmlTemplate } from '../templates/confirmations-pdf.template';

export class OpenConfirmationsService {

  constructor() {}

  public async createOpenConfirmation(createOpenConfirmationDto: CreateOpenConfirmationDto) {
    const { event: eventId } = createOpenConfirmationDto;
    const eventExists = await EventModel.findById(eventId);

    if (!eventExists) {
      throw CustomError.notFound(`El evento con ID ${eventId} no existe`);
    }

    const openConfirmation = new OpenConfirmationModel({
      ...createOpenConfirmationDto,
    });

    await openConfirmation.save();

    return OpenConfirmationEntity.fromObject(openConfirmation);
  }

  public async getOpenConfirmationsByEvent(eventId: string, paginationDto: PaginationDto, name?: string) {
    const { page, limit } = paginationDto;

    const eventExists = await EventModel.findById(eventId);
    if (!eventExists) {
      throw CustomError.notFound(`El evento con ID ${eventId} no existe`);
    }

    const filter: any = { event: eventId };
    if (name && name.trim() !== '') {
      const cleanTerm = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = { $regex: cleanTerm, $options: 'i' };
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { phone: searchRegex },
      ];
    }

    const [total, openConfirmations] = await Promise.all([
      OpenConfirmationModel.countDocuments(filter),
      OpenConfirmationModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return {
      page,
      limit,
      total,
      confirmations: openConfirmations.map((c) => OpenConfirmationEntity.fromObject(c)),
    };
  }

  public async getOpenConfirmationById(id: string) {
    const openConfirmation = await OpenConfirmationModel.findById(id);

    if (!openConfirmation) {
      throw CustomError.notFound(`La confirmación abierta con ID ${id} no existe`);
    }

    return OpenConfirmationEntity.fromObject(openConfirmation);
  }

  public async updateOpenConfirmationById(id: string, updateOpenConfirmationDto: UpdateOpenConfirmationDto) {
    const openConfirmation = await OpenConfirmationModel.findById(id);

    if (!openConfirmation) {
      throw CustomError.notFound(`La confirmación abierta con ID ${id} no existe`);
    }

    const updatedConfirmation = await OpenConfirmationModel.findByIdAndUpdate(
      id,
      updateOpenConfirmationDto.values,
      { new: true }
    );

    return OpenConfirmationEntity.fromObject(updatedConfirmation!);
  }

  public async deleteOpenConfirmationById(id: string) {
    const openConfirmation = await OpenConfirmationModel.findByIdAndDelete(id);

    if (!openConfirmation) {
      throw CustomError.notFound(`La confirmación abierta con ID ${id} no existe`);
    }

    return { message: 'Confirmación eliminada correctamente' };
  }


  public async getConfirmationStats(eventId: string) {
    const eventExists = await EventModel.findById(eventId);
    if (!eventExists) {
      throw CustomError.notFound(`El evento con ID ${eventId} no existe`);
    }

    const confirmations = await OpenConfirmationModel.find({ event: eventId });

    let totalRegistros = confirmations.length;
    let attending = 0;
    let notAttending = 0;
    let totalAdults = 0;
    let totalKids = 0;

    for (const conf of confirmations) {
      if (conf.willAttend) {
        attending++;
        totalAdults += conf.adultsQuantity || 0;
        totalKids += conf.kidsQuantity || 0;
      } else {
        notAttending++;
      }
    }

    const totalPeople = totalAdults + totalKids;

    return {
      totalRegistros,
      attending,
      notAttending,
      totalAdults,
      totalKids,
      totalPeople,
    };
  }

  public async generateConfirmationsPdf(eventId: string, res: Response) {
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw CustomError.notFound(`El evento con ID ${eventId} no existe`);
    }

    const confirmations = await OpenConfirmationModel.find({ event: eventId }).sort({ createdAt: -1 });

    const htmlContent = generateConfirmationsHtmlTemplate({
      eventName: event.name,
      clientName: event.client || undefined,
      eventDate: event.eventDate,
      eventType: event.eventType,
      confirmations: confirmations as any,
    });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

      const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
      });

      const buffer = Buffer.from(pdfUint8Array);
      const cleanEventName = event.name.replace(/[^a-zA-Z0-9]/g, '_');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Confirmaciones_${cleanEventName}.pdf"`
      );
      res.setHeader('Content-Length', buffer.length.toString());

      res.end(buffer);
    } finally {
      await browser.close();
    }
  }

}
