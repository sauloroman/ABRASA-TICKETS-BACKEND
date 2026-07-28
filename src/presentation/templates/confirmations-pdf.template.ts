export interface PdfTemplateData {
  eventName: string;
  clientName?: string;
  eventDate: string;
  eventType?: string;
  confirmations: Array<{
    firstName: string;
    lastName: string;
    phone: string;
    willAttend: boolean;
    adultsQuantity: number;
    kidsQuantity: number;
    registrationDate: Date | string;
  }>;
}

export const generateConfirmationsHtmlTemplate = (data: PdfTemplateData): string => {
  const { eventName, clientName, eventDate, confirmations } = data;

  let totalAdults = 0;
  let totalKids = 0;
  let totalAssisting = 0;
  let notAssisting = 0;

  confirmations.forEach((item) => {
    if (item.willAttend) {
      totalAssisting++;
      totalAdults += item.adultsQuantity || 0;
      totalKids += item.kidsQuantity || 0;
    } else {
      notAssisting++;
    }
  });

  const totalPeople = totalAdults + totalKids;
  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const rowsHtml = confirmations
    .map((item, index) => {
      const totalGuest = (item.adultsQuantity || 0) + (item.kidsQuantity || 0);
      const formattedDate = new Date(item.registrationDate).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const attendanceBadge = item.willAttend
        ? `<span class="badge badge-yes">Sí asistirá</span>`
        : `<span class="badge badge-no">No asistirá</span>`;

      return `
        <tr>
          <td class="text-center bold text-muted">${index + 1}</td>
          <td>
            <div class="name-cell">
              <strong>${item.firstName} ${item.lastName}</strong>
            </div>
          </td>
          <td>${item.phone || 'N/A'}</td>
          <td class="text-center">${attendanceBadge}</td>
          <td class="text-center">${item.adultsQuantity || 0}</td>
          <td class="text-center">${item.kidsQuantity || 0}</td>
          <td class="text-center bold">${totalGuest}</td>
          <td class="text-center text-muted font-sm">${formattedDate}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Confirmaciones - ${eventName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1f1715;
          background-color: #ffffff;
          padding: 24px;
          font-size: 12px;
          line-height: 1.4;
        }

        .header {
          border-bottom: 2px solid #8b6c59;
          padding-bottom: 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .brand-title {
          font-size: 20px;
          font-weight: 700;
          color: #623637;
          letter-spacing: -0.5px;
        }

        .event-subtitle {
          font-size: 14px;
          color: #8b6c59;
          font-weight: 600;
          margin-top: 4px;
        }

        .meta-info {
          text-align: right;
          font-size: 11px;
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .stat-card {
          background-color: #faf7f5;
          border: 1px solid #e8dfd8;
          border-radius: 8px;
          padding: 10px 12px;
          text-align: center;
        }

        .stat-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #888;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #623637;
        }

        .table-wrapper {
          width: 100%;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background-color: #623637;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 8px 10px;
          border: 1px solid #623637;
        }

        td {
          padding: 8px 10px;
          border: 1px solid #eee;
          font-size: 11px;
        }

        tr:nth-child(even) td {
          background-color: #fdfbfb;
        }

        .text-center { text-align: center; }
        .bold { font-weight: 700; }
        .text-muted { color: #666; }
        .font-sm { font-size: 10px; }

        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 9px;
          text-transform: uppercase;
        }

        .badge-yes {
          background-color: #e6fcf5;
          color: #2b8a3e;
          border: 1px solid #b2f2bb;
        }

        .badge-no {
          background-color: #fff5f5;
          color: #c5221f;
          border: 1px solid #ffc9c9;
        }

        .footer {
          margin-top: 30px;
          padding-top: 12px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand-title">ABRASA Tickets &mdash; Reporte de Confirmaciones</div>
          <div class="event-subtitle">${eventName} ${clientName ? `(${clientName})` : ''}</div>
        </div>
        <div class="meta-info">
          <div>Fecha del Evento: <strong>${eventDate || 'N/A'}</strong></div>
          <div>Generado: <strong>${currentDate}</strong></div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Registros</div>
          <div class="stat-value">${confirmations.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Sí Asistirán</div>
          <div class="stat-value" style="color: #2b8a3e;">${totalAssisting}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">No Asistirán</div>
          <div class="stat-value" style="color: #c5221f;">${notAssisting}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Adultos (Sí)</div>
          <div class="stat-value">${totalAdults}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Personas</div>
          <div class="stat-value">${totalPeople}</div>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Nombre Completo</th>
              <th style="width: 100px;">Teléfono</th>
              <th style="width: 90px;" class="text-center">Asistencia</th>
              <th style="width: 50px;" class="text-center">Adultos</th>
              <th style="width: 50px;" class="text-center">Niños</th>
              <th style="width: 50px;" class="text-center">Total</th>
              <th style="width: 90px;" class="text-center">Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml.length > 0 ? rowsHtml : '<tr><td colspan="8" class="text-center">No hay confirmaciones registradas.</td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div>ABRASA Event Management System</div>
        <div>Reporte oficial de confirmaciones</div>
      </div>
    </body>
    </html>
  `;
};
