export interface BulkTicketItem {
    name: string,
    phone?: string,
    adultsQuantity?: number,
    kidsQuantity?: number,
    table?: string
}

export class CreateBulkTicketDto {
    private constructor(
        public readonly event: string,
        public readonly tickets: BulkTicketItem[]
    ) { }

    public static create(object: { [key: string]: any }): [string?, CreateBulkTicketDto?] {
        const { event, tickets } = object

        if (!event) return ['El ID del evento es requerido', undefined];
        if (!tickets || !Array.isArray(tickets) || tickets.length === 0) return ['La lista de boletos debe ser un arreglo no vacío', undefined];

        const sanitizedTickets: BulkTicketItem[] = [];

        for (let i = 0; i < tickets.length; i++) {
            const item = tickets[i];

            if (!item.name || item.name.trim() === '') {
                return [`El boleto en la posicion ${i + 1} no tiene un nombre valido`, undefined];
            }

            const phone = (!item.phone || String(item.phone).trim() === '') 
                ? '0000000000' 
                : String(item.phone).trim();

            sanitizedTickets.push({
                ...item,
                phone
            });
        }

        return [undefined, new CreateBulkTicketDto(event, sanitizedTickets)];
    }
}