import qrCode from 'qrcode';

export const qrCodeGenerator = {
  generateQrCode: (data: any, fileName: string) => {
    return new Promise((resolve, _) => {
      qrCode.toFile(
        fileName,
        JSON.stringify(data),
        { errorCorrectionLevel: 'M', type: 'png', margin: 2 },
        (error) => {
          if (error) return resolve(null);
          resolve(fileName);
        }
      );
    });
  },
};
