import fs from 'fs';
import path from 'path';
import { UploadedFile } from "express-fileupload";
import { CustomError } from "../../domain/errors";
import { cloudImages, uuid } from '../../config'

export class FileUploadService {

  private checkFolder( folderPath: string ) {
    if ( !fs.existsSync( folderPath )) {
      fs.mkdirSync( folderPath, { recursive: true } );
    }
  }

  public async uploadFileServer (
    file: UploadedFile | any,
    folder: string,
    validExtentions: string[] = ['png', 'jpg', 'jpeg', 'webp'],
  ) {

    try {

      const fileExtention = file.mimetype.split('/')[1] ?? '';

      if ( !validExtentions.includes( fileExtention ) ) {
        throw CustomError.badRequest(`Invalid Extention: ${fileExtention}. Valid ones ${validExtentions} `);
      } 

      const fileName = `${uuid.v4()}.${fileExtention}`;

      const destination = path.join( __dirname, '../../', folder );

      this.checkFolder( destination );

      const filePath = `${destination}/${fileName}`;

      file.mv(filePath);

      return fileName;

    } catch (error) {
      console.log(`${error}`);
      return null;   
    }
  }

  public async uploadFileCloud (
    file: UploadedFile | any,
    folder: string,
    validExtentions: string[] = ['png', 'jpg', 'jpeg', 'webp'],
  ) {

    const fileExtention = file.mimetype.split('/')[1] ?? '';

    if ( !validExtentions.includes( fileExtention ) ) {
      throw CustomError.badRequest(`Invalid Extention: ${fileExtention}. Valid ones ${validExtentions} `);
    } 

    const { tempFilePath } = file;

    const imageUrl = await cloudImages.getUrlImage( tempFilePath, folder ); 

    return imageUrl;
  }

  public async destroyImageCloud ( filePath: string ) {

    const imageDestroyed = await cloudImages.destroyImage( filePath );

    if ( !imageDestroyed ) {
      throw CustomError.internalServerError('Image was not deleted from cloud')
    }

    return true;
  }

  public async uploadCode ( 
    filePath: string | any,
    folder: string,
  ) {

    const qrCodeUrl = await cloudImages.getUrlImage( filePath, folder );

    if ( !qrCodeUrl ) {
      throw CustomError.internalServerError('Image was not uploaded');
    }

    return qrCodeUrl;
  }

}