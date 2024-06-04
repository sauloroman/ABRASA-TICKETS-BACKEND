import { envs } from './envs.plugin';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(envs.CLOUDINARY_URL);

export const cloudImages = {

  getUrlImage: async (filePath: any, folder: string) => {
    const { secure_url: imageUrl } = await cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        resource_type: 'image',
      }
    );

    return imageUrl;
  },

  destroyImage: async ( filePath: string) => {

    try {
    
      await cloudinary.api.delete_resources(
        [ filePath ],
        { type: 'upload', resource_type: 'image' }
      );

      return true;

    } catch (error) {
      console.log(`${error}`);
      return false;      
    }

  },

  deleteFolder: async( filePath: string ) => {

    try {

      await cloudinary.api.delete_folder( filePath );
      return true;

    } catch (error) {
      console.log(`${error}`);
      return false;
    }

  },

  getUrlCode: ( code: unknown, folder: string ) => {

    cloudinary.uploader.upload_stream({ 
      resource_type: 'image',
      folder: folder
    }, (error, result) => {
        if (error) {
          return null;
        } else {
          return result?.url;
        }
    }).end(code);

  }

};
