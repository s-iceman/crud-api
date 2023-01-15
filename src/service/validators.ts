import { ENDPOINT } from './constants';

const ENDPOINT_PATTERN = new RegExp('^' + ENDPOINT + '\/?');
const UUID_PATTERN = new RegExp('^([\\w\\d]{8}(-[\\w\\d]{4}){3}-[\\w\\d]{12})$');

const REQUIRED_FIELDS = ['age', 'username', 'hobbies'].sort().join(',');

const validateUserId = (userId: string): boolean => {
  return UUID_PATTERN.test(userId);
}

const validateEndpoint = (url: string): boolean => {
  if (ENDPOINT_PATTERN.test(url)) {
    return true;
  }
  return url.slice(ENDPOINT.length, 1) == '\\';
}

const validateUserFields = (params: object): boolean => {
  const fields = Object.keys(params).sort().join(',');
  if (fields !== REQUIRED_FIELDS) {
    return false;
  }

  const username = <string>params['username'];
  const age = <string>params['age'];
  const hobbies = <string>params['hobbies'];

  return (
    typeof username === 'string' && username.length > 0 &&
    typeof age === 'number' && age >= 0 &&
    Array.isArray(hobbies) && hobbies.every(i => typeof i === 'string')
  );
}

export {
  validateEndpoint,
  validateUserId,
  validateUserFields,
}
