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
  AddressNotFound = `Sorry, we couldn't find this address.`,
  UserNotFound = `User with this id not found`,
  InvalidUserId = `Invalid format of user id`,
}

export {
  StatusCodes,
  ENDPOINT,
  Messages,
}