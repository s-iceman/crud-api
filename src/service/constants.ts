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
  NotFound = `Sorry, we couldn't find this address.`,
}

export {
  StatusCodes,
  ENDPOINT,
  Messages,
}