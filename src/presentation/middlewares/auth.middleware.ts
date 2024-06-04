import { NextFunction, Request, Response } from "express";
import { jwtGenerator } from '../../config/plugins/jwt.plugin';
import { UserModel } from "../../data";
import { UserEntity } from '../../domain/entities/user.entity';

export class AuthMiddleware {

  public static async validateJWT ( req: Request, res: Response, next: NextFunction ) {

    const authorization = req.header('Authorization');

    if ( !authorization ) {
      return res.status(401).json({ error: 'No hay token' });
    }

    if ( !authorization.startsWith('Bearer ') ) {
      return res.status(401).json({ error: 'Inicia sesión primero'});
    }

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await jwtGenerator.validateToken<{ id: string }>( token );

      if ( !payload ) {
        return res.status(401).json({ error: 'El Token es invalido'});
      }

      const user = await UserModel.findById( payload.id );

      if ( !user ) {
        return res.status(401).json({ error: 'Token Invalido - Usuario' });
      }

      if ( !user.isActive ) {
        return res.status(401).json({ error: 'Token Invalido - Usuario no activo'})
      }

      const { password, ...restUserEntity } = UserEntity.fromObject( user );
      req.body.user = restUserEntity;
      
      next();

    } catch (error) {
      
      console.log(`${error}`);

      res.status(500).json({ error: 'Internal Server Error' })

    }


  }

}