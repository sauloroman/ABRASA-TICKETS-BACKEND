import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  
  MONGO_URI: env.get('MONGO_URI').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  MONGO_USER: env.get('MONGO_USER').required().asString(),
  MONGO_PASSWORD: env.get('MONGO_PASSWORD').required().asString(),

  JWT_SEED: env.get('JWT_SEED').required().asString(),

  SEND_EMAIL: env.get('SEND_EMAIL').required().asBool(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
  
  WEBSERVICE_URL: env.get('WEBSERVICE_URL').required().asString(), 

  GOOGLE_CLIENT_ID: env.get('GOOGLE_CLIENT_ID').required().asString(),
  GOOGLE_SECRET_ID: env.get('GOOGLE_SECRET_ID').required().asString(),

  CLOUDINARY_URL: env.get('CLOUDINARY_URL').required().asString(),

}