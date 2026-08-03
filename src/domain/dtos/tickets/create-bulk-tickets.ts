export interface BulkTicketItem {
    name: string,
    phone: string,
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

        for (let i = 0; i < tickets.length; i++) {
            const item = tickets[i]

            if (!item.name || item.name.trim() === '') {
                return [`El boleto en la posicion ${i + 1} no tiene un nombre valido`, undefined]
            }

            if (!item.phone || String(item.phone).trim() === '') {
                return [`El boleto "${item.name}" no tiene un numero de telefono valido`, undefined]
            }
        }

        return [undefined, new CreateBulkTicketDto(event, tickets)]
    }
}