enum StatusCodes {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
};

const ENDPOINT = '/api/users';

enum Messages {
  AddressNotFound = `Sorry, we couldn't find this address`,
  UserNotFound = 'User with this id not found',
  InvalidUserId = 'Invalid format of user id',
  InvalidJsonFormat = 'Invalid JSON format. You should use double quotes.',
  InvalidParams = 'Unable to create a user. You have sent invalid parameters (required fields: name, age, hobbies).',
}

export {
  StatusCodes,
  ENDPOINT,
  Messages,
}