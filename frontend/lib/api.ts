//@ts-expect-error
import { Client } from '@gadget-client/ecomrag';

const api = new Client({
  authenticationMode: {
    browserSession: true,
  },
});

export default api;
