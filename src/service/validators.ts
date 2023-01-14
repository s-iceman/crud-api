import { ENDPOINT } from '../constants';


export const validate = (url: string) : boolean => {
  return url.startsWith(ENDPOINT);
}
