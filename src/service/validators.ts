import { ENDPOINT } from './constants';

const ENDPOINT_PATTERN = new RegExp('^' + ENDPOINT + '\/?');
const UUID_PATTERN = new RegExp('^([\\w\\d]{8}(-[\\w\\d]{4}){3}-[\\w\\d]{12})$');


const validateUserId = (userId: string): boolean => {
  return UUID_PATTERN.test(userId);
}

const validateEndpoint = (url: string): boolean => {
  if (ENDPOINT_PATTERN.test(url)) {
    return true;
  }
  return url.slice(ENDPOINT.length, 1) == '\\';
}

const validateUserFields = (): boolean => {
  return false;
}

export {
  validateEndpoint,
  validateUserId,
  validateUserFields,
}
