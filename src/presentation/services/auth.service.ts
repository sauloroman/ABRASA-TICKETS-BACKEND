import fs from 'fs';
import path from 'path';
import { UserEntity } from '../../domain/entities';

import {
  RegisterUserDto,
  LoginUserDto,
  ValidateCodeDto,
  LoginGoogleDto,
  PasswordEmailDto,
  PasswordChangeDto,
} from '../../domain/dtos';

import { CustomError } from '../../domain/errors';

import { EmailService } from './email.service';

import { UserModel, ProfileModel } from '../../data';

import {
  bcryptAdapter,
  jwtGenerator,
  randomString,
  googleVerify,
} from '../../config';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const emailExists = await UserModel.findOne({
      email: registerUserDto.email,
    });

    if (emailExists) {
      throw CustomError.badRequest('El correo ya existe. Intente con otro.');
    }

    try {
      const currentDate = new Date().toLocaleString();

      const userProfile = new ProfileModel();
      const user = new UserModel({ ...registerUserDto });

      user.password = bcryptAdapter.hash(registerUserDto.password);
      user.activateKey = randomString.generateRandomNumberString(5);
      user.profile = userProfile.id;
      user.lastLogin = currentDate;
      user.createdAt = currentDate;

      userProfile.user = user.id;

      await user.save();
      await userProfile.save();

      await this.sendEmailValidationCode(
        user.email,
        user.activateKey,
        user._id
      );

      const { password, ...restUserEntity } = UserEntity.fromObject(user);

      return {
        user: { ...restUserEntity },
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    try {
      const user = await UserModel.findOne({ email: loginUserDto.email });

      if (!user) {
        throw CustomError.notFound(`El correo ${loginUserDto.email} no existe`);
      }

      if (!user.emailValidated) {
        throw CustomError.unauthorized(
          `Valida tu correo para ingresar. ${user.email}. Te enviamos un correo. Revisa tu carpeta de spam.`
        );
      }

      const isCorrectPassword = bcryptAdapter.compare(
        loginUserDto.password,
        user.password
      );

      if (!isCorrectPassword) {
        throw CustomError.unauthorized('La contraseña es incorrecta');
      }

      user.lastLogin = new Date().toLocaleString();
      await user.save();

      const { password, ...restUserEntity } = UserEntity.fromObject(user);

      const token = await jwtGenerator.generateToken({ id: user.id });

      if (!token) {
        throw CustomError.internalServerError('Error while creating JWT');
      }

      return {
        user: { ...restUserEntity },
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  public async googleSingIn(loginGoogleDto: LoginGoogleDto) {
    const { idToken } = loginGoogleDto;

    try {
      const { name, email, picture } = await googleVerify(idToken);

      let user = await UserModel.findOne({ email });

      if (!user) {
        const today = new Date().toLocaleString();

        const userData = {
          name: name,
          email: email,
          password: 'Password no neccesary',
          google: true,
          lastLogin: today,
          createdAt: today,
          emailValidated: true,
          activateKey: '',
        };

        const profile = new ProfileModel({ image: picture });
        user = new UserModel({ ...userData, profile });
        await user.save();

        profile.user = user.id;
        await profile.save();
      }

      if (!user?.isActive) {
        throw CustomError.unauthorized(
          'Usuario bloqueado. Hable con el administrador'
        );
      }

      const { password, ...restUserEntity } = UserEntity.fromObject(user);

      const token = await jwtGenerator.generateToken({ id: user.id });

      return {
        user: restUserEntity,
        token: token,
      };
    } catch (error) {
      console.log(`${error}`);
      throw CustomError.internalServerError('Token was not verified');
    }
  }

  public renewToken = async (user: UserEntity) => {
    const token = await jwtGenerator.generateToken({ id: user.id });

    if (!token) {
      throw CustomError.internalServerError('Error while creating JWT');
    }

    return token;
  };

  public validateCode = async (
    validateCodeDto: ValidateCodeDto,
    token: string
  ) => {
    const { code } = validateCodeDto;
    const payload = await jwtGenerator.validateToken(token);

    if (!payload) {
      throw CustomError.unauthorized('Token no valido');
    }

    const { id } = payload as { id: string };

    if (!id) {
      throw CustomError.internalServerError('El id no está en el token');
    }

    const user = await UserModel.findById(id);

    if (!user) {
      throw CustomError.internalServerError('El usuario no existe');
    }

    if (user.activateKey !== code) {
      throw CustomError.badRequest('Codigo Incorrecto.');
    }

    user.activateKey = '';
    user.emailValidated = true;
    await user.save();

    const { password, ...restUserEntity } = UserEntity.fromObject(user);
    const tokenSesion = await jwtGenerator.generateToken({ id: user.id });

    return {
      user: { ...restUserEntity },
      token: tokenSesion,
    };
  };

  public changePasswordEmail = async (passwordEmailDto: PasswordEmailDto) => {
    const { email } = passwordEmailDto;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw CustomError.notFound(`El usuario con correo "${email}" no existe`);
    }

    if (user.google) {
      throw CustomError.badRequest(
        'El correo es cuenta de google. No puedes cambiar la contraseña. Solo inicia sesión.'
      );
    }

    if (!user.isActive) {
      throw CustomError.badRequest(
        'El usuario no está activo. Contacte con el desarrollador'
      );
    }

    if (!user.emailValidated) {
      throw CustomError.badRequest(
        'La cuenta no ha sido validada. Primero valide con el mensaje de su correo.'
      );
    }

    const userEntity = UserEntity.fromObject(user);

    await this.sendEmailToChangePassword(userEntity);

    return {
      msg: 'Se han enviado las instrucciones a tu correo. Revisalo.',
    };
  };

  public changePassword = async (
    passwordChangeDto: PasswordChangeDto,
    token: string
  ) => {
    const { newPassword } = passwordChangeDto;
    const payload = await jwtGenerator.validateToken(token);

    if (!payload) {
      throw CustomError.unauthorized('Token no valido');
    }

    const { id } = payload as { id: string };

    if (!id) {
      throw CustomError.internalServerError('El id no está en el token');
    }

    const user = await UserModel.findById(id);

    if (!user) {
      throw CustomError.internalServerError('El usuario no existe');
    }

    user.password = bcryptAdapter.hash(newPassword);
    await user.save();

    return {
      msg: 'La contraseña ha sido cambiada exitosamente',
    };
  };

  private sendEmailValidationCode = async (
    email: string,
    code: string,
    id: any
  ) => {
    const token = await jwtGenerator.generateToken({ id });

    if (!token)
      throw CustomError.internalServerError('Error while creating jwt');

    const topEmail = fs.readFileSync(
      path.join(
        __dirname,
        '../../../public/server/templates/email/email-top.html'
      )
    );
    const bottomEmail = fs.readFileSync(
      path.join(
        __dirname,
        '../../../public/server/templates/email/email-bottom.html'
      )
    );

    const html = `
        <div style="margin: 0 auto; width: 120rem; max-width: 95%;">
          ${topEmail}
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin: 0 auto; max-width: 95%; width: 450px;"> 
            <h1 style="text-align: center;">Confirma tu correo electrónico</h1>
            <p style="text-align: center;">Comienza a utilizar nuestra aplicación. Presiona el siguiente botón e ingresa el código de verificación.</p>
            <h2 style="text-align: center;">Tu código: ${code}</h2>
            <a style="background-color: #623637; text-decoration: none; color: #fff; width: 100%; display: inline-block; padding: 10px; text-align: center;" href="http://localhost:5173/auth/confirm/${token}/${email}">Presiona aqui</a>
          </div>
          ${bottomEmail}
        </div>
      `;

    const options = {
      to: email,
      subject: 'Confirma tu correo',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServerError('Error sending email');

    return true;
  };

  private sendEmailToChangePassword = async ({ id, email }: UserEntity) => {
    const token = await jwtGenerator.generateToken({ id });

    if (!token)
      throw CustomError.internalServerError('Error while creating jwt');

    const topEmail = fs.readFileSync(
      path.join(
        __dirname,
        '../../../public/server/templates/email/email-top.html'
      )
    );
    const bottomEmail = fs.readFileSync(
      path.join(
        __dirname,
        '../../../public/server/templates/email/email-bottom.html'
      )
    );

    const htmlBody = `
      <div style="margin: 0 auto; width: 120rem; max-width: 95%;">
        ${topEmail}
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin: 0 auto; max-width: 95%; width: 450px;"> 
          <h1>Cambiar contraseña</h1>
          <p>Para cambiar tu contraseña en <span style="font-weight: bold;">ABRASA</span> debes presionar el siguiente boton</p>  
          <a 
          style="background-color: #623637; text-decoration: none; color: #fff; width: 100%; display: inline-block; padding: 10px; text-align: center;" 
          href="http://localhost:5173/auth/password/new-password/${token}">Ir a cambiar</a>
          <p>Si no solicitaste el cambio de contraseña ignora este correo.</p>
        </div>
        ${bottomEmail}
      </div>
    `;

    const options = {
      to: email,
      subject: 'Cambiar contraseña - Abrasa App',
      htmlBody: htmlBody,
    };

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) {
      throw CustomError.internalServerError('Error al mandar el correo');
    }

    return true;
  };
}
