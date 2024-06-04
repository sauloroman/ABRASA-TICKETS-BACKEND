import jwt from 'jsonwebtoken';
import { envs } from './envs.plugin';

const JWT_SEED = envs.JWT_SEED;

export const jwtGenerator = {

  async generateToken( payload: any, duration: string = '2h' ) {
    return new Promise( ( resolve, _ ) => {

      jwt.sign( payload, JWT_SEED, { expiresIn: duration }, ( err, token ) => {
        if ( err ) return resolve( null );
        resolve( token );
      });

    }) 
  },

  async validateToken<T>( token: string ): Promise<T | null> {
    return new Promise( ( resolve, _ ) => {

      jwt.verify( token, JWT_SEED, ( err, decoded ) => {
        if ( err ) return resolve( null );
        resolve( decoded as T );
      });

    })
  }

}