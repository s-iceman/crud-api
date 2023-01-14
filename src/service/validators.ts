import { ENDPOINT } from './constants';

const PATTERN = new RegExp('^' + ENDPOINT + '(//[\w]{8}(-[\w]{4}){3}-[\w]{12})?$');

export const validate = (url: string) : boolean => {
  return PATTERN.test(url);
}
