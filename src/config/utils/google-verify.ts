import { OAuth2Client } from 'google-auth-library';
import { envs } from '../plugins/envs.plugin';

const client = new OAuth2Client( envs.GOOGLE_CLIENT_ID );

export async function googleVerify( token = '' ) {

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: envs.GOOGLE_CLIENT_ID, 
  });

  const payload = ticket.getPayload() as { name: string, picture: string, email: string };
  const { name, picture, email } = payload;

  return {
    name,
    picture,
    email,
  }

}