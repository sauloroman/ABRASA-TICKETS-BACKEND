import nodemailer, { Transporter } from "nodemailer";

interface Options {
  mailerService: string;
  mailerEmail: string;
  senderEmailPassword: string;
  postToProvider: boolean;
}

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  path: string;
  filename: string;
}

export class EmailService {

  private transporter: Transporter
  private readonly postToProvider: boolean;

  constructor( options: Options ) {
    const { mailerEmail, mailerService, senderEmailPassword, postToProvider } = options;

    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      }
    })

    this.postToProvider = postToProvider;
  }

  public async sendEmail( sendMailOptions: SendMailOptions ): Promise<boolean> {

    const { to, htmlBody, subject, attachments = [] } = sendMailOptions;

    try {
      
      if ( !this.postToProvider ) return true;

      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      console.log( sentInformation );

      return true;

    } catch (error) {
      console.log(`${error}`);
      return false;
    }

  }

}