import { envs } from "../../config";
import { CustomError } from "../../domain/errors";

export interface SendWhatsAppTicketParams {
    phone: string,
    guestName: string,
    clientName: string,
    eventDate: string,
    invitationUrl: string,
    keyPass: string
}

export interface ResponseWhatsAppMessage {
    success: boolean,
    messageId?: string,
    error?: string
}

export interface BulkWhatsAppTicketItem extends SendWhatsAppTicketParams {
    ticketId: string
}

export class WhatsAppService {

    public formatPhoneNumber(phone: string): string {
        const clearPhone = phone.replace(/\D/g, '')

        if (clearPhone.length === 10) {
            return `52${clearPhone}`
        }

        return clearPhone;
    }

    public async sendTicketMessage(params: SendWhatsAppTicketParams): Promise<ResponseWhatsAppMessage> {

        const { phone, guestName, clientName, eventDate, invitationUrl, keyPass } = params

        const formattedPhone = this.formatPhoneNumber(phone)

        if (!formattedPhone || formattedPhone.length < 10) {
            throw CustomError.badRequest(`El número de teléfono ${phone} no es valido para WhatsApp`)
        }

        const url = `${envs.WHATSAPP_CLOUD_API_URL}/${envs.WHATSAPP_PHONE_NUMBER_ID}/messages`

        const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: formattedPhone,
            type: 'template',
            template: {
                name: envs.WHATSAPP_TEMPLATE_NAME,
                language: {
                    code: envs.WHATSAPP_LANG_CODE
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: guestName || 'Invitado' },
                            { type: 'text', text: clientName || 'Atelier Eventos' },
                            { type: 'text', text: eventDate || 'Próximamente' },
                            { type: 'text', text: invitationUrl || 'N/A' },
                            { type: 'text', text: keyPass || 'N/A' },
                        ]
                    }
                ]
            }
        }

        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${envs.WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json();

            if (!response.ok) {
                console.error('Error de WhatsApp Cloud API:', data)
                const errorMsg = data?.error?.message || 'Error al enviar mensaje por WhatsApp'
                throw CustomError.badRequest(`WhatsApp API Error: ${errorMsg}`)
            }

            const messageId = data.messages && data.messages[0] ? data.messages[0].id : undefined

            return {
                success: true,
                messageId
            }

        } catch (error) {
            if (error instanceof CustomError) throw error;
            console.log('WhatsApp Service Error: ', error)
            throw CustomError.internalServerError('Fallo de conexión con la API de WhatsApp')
        }

    }

    public async sendBulkTickets(tickets: BulkWhatsAppTicketItem[]) {

        let sentCount = 0
        let failedCount = 0
        const details: Array<{ ticketId: string, phone: string, success: boolean, error?: string }> = []

        for (const ticket of tickets) {
            try {

                await this.sendTicketMessage({
                    phone: ticket.phone,
                    guestName: ticket.guestName,
                    clientName: ticket.clientName,
                    eventDate: ticket.eventDate,
                    invitationUrl: ticket.invitationUrl,
                    keyPass: ticket.keyPass
                })

                sentCount++
                details.push({
                    ticketId: ticket.ticketId,
                    phone: ticket.phone,
                    success: true
                })

            } catch (err: any) {

                failedCount++
                details.push({
                    ticketId: ticket.ticketId,
                    phone: ticket.phone,
                    success: false,
                    error: err.message || 'Error Desconocido'
                })

            }

            await new Promise(resolve => setTimeout(resolve, 400))
        }

        return {
            total: tickets.length,
            sent: sentCount,
            failed: failedCount,
            details
        }

    }

}