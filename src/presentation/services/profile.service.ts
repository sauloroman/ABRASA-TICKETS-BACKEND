import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { ProfileModel, UserModel } from '../../data';
import { PaginationDto } from '../../domain/dtos';
import { ProfileEntity } from '../../domain/entities/profile.entity';
import { CustomError } from '../../domain/errors';
import { FileUploadService } from './file-upload.service';

export class ProfileService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  public async getAllProfiles(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [totalProfiles, profiles] = await Promise.all([
      ProfileModel.countDocuments(),
      ProfileModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user'),
    ]);

    const profilesEntity = profiles.map(ProfileEntity.fromObjet);

    return {
      page: page,
      limit: limit,
      total: totalProfiles,
      next: `/api/profile?page=${page + 1}&limit=${limit}`,
      prev:
        page - 1 > 0 ? `/api/profile?page=${page - 1}&limit=${limit}` : null,
      profiles: profilesEntity,
    };
  }

  public async getProfileById(profileID: string) {
    const profile = await ProfileModel.findById(profileID).populate('user');

    if (!profile) {
      throw CustomError.notFound(`Profile with id ${profileID} does not exits`);
    }

    const profileEntity = ProfileEntity.fromObjet(profile);

    return profileEntity;
  }

  public async updateProfileById(profileID: string, newProfileInfo: any) {
    if (newProfileInfo.name) {
      const user = await UserModel.findOne({ profile: profileID });
      user!.name = newProfileInfo.name;
      await user!.save();
    }

    const profileUpdated = await ProfileModel.findOneAndUpdate(
      { _id: profileID },
      newProfileInfo,
      { new: true, runValidators: true }
    ).populate('user');

    if (!profileUpdated) {
      throw CustomError.notFound(`Profile with id ${profileID} does not exits`);
    }

    const profileUpdatedEntity = ProfileEntity.fromObjet(profileUpdated!);

    return profileUpdatedEntity;
  }

  public async uploadProfileImages(
    file: UploadedFile,
    id: string,
    type: string
  ) {
    const profile = await ProfileModel.findById(id).populate('user');

    if (!profile) {
      throw CustomError.notFound(`Profile with id ${id} not found`);
    }

    const fileName = await this.fileUploadService.uploadFileServer(
      file,
      `uploads/profile/${id}`
    );

    if (!fileName) {
      throw CustomError.internalServerError('File was not saved');
    }

    if ( profile[`${type === 'image' ? 'image' : 'coverImage'}`] ) {

      const pathImage = path.join(
        __dirname,
        `../../uploads/profile/${id}`,
        profile[`${type === 'image' ? 'image' : 'coverImage'}`] as string,
      );

      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }

    profile[`${type === 'image' ? 'image' : 'coverImage'}`] = fileName;

    await profile.save();

    const profileEntity = ProfileEntity.fromObjet(profile);

    return profileEntity;
  }

  public async uploadProfileImagesCloud(
    file: UploadedFile,
    id: string,
    type: string
  ) {
    const profile = await ProfileModel.findById(id).populate('user');

    if (!profile) {
      throw CustomError.notFound(`Profile with id ${id} not found`);
    }

    const fileName = await this.fileUploadService.uploadFileCloud( file, `abrasa/profile/${id}` );

    if (!fileName) {
      throw CustomError.internalServerError('File was not saved');
    }

    if ( profile[`${type === 'image' ? 'image' : 'coverImage'}`] ) {
      const imageId = profile[`${type === 'image' ? 'image' : 'coverImage'}`]?.split('/').at(-1)?.split('.')[0];
      await this.fileUploadService.destroyImageCloud(`abrasa/profile/${id}/${imageId}`);
    }

    profile[`${type === 'image' ? 'image' : 'coverImage'}`] = fileName;

    await profile.save();

    const profileEntity = ProfileEntity.fromObjet(profile);

    return profileEntity;
  }


  
}
