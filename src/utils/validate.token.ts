import axios from 'axios';
import { CustomClientException } from 'src/exception/custom.exception';

export async function getToken(token: string) {
  let response;
  try {
    response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );
  } catch (err) {
    throw new CustomClientException(err.message, 400, 'BAD_REQUEST');
  }
  return response;
}
