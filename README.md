# Simple CRUD API

## Installation

Clone project:
```bash
git clone https://github.com/s-iceman/crud-api.git
```

Setup:
```bash
npm install
```

## Available modes

1. Development mode with hot-reloading:
```bash
npm run start:dev
```

2. Production mode, running the bundled file:
```bash
npm run start:prod
```

**Note:** On MacOS you may need to edit `package.json` (line 6), replacing `&&` with `,`.

3. Run tests:
```bash
npm run test
```

## Endpoint

```
api/users
```

## Requests

**GET api/users** - to get all persons
- Server should answer with status code 200 and all users records

**GET api/users/{userId}** - to get one person
- Server should answer with status code 200 and and record with id === userId if it exists
- Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
- Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

**POST api/users** - to create record about new user and store it in database
- Server should answer with status code 201 and newly created record
- Server should answer with status code 400 and corresponding message if request body does not contain required fields

**PUT api/users/{userId}** - to update existing user
- Server should answer with status code 200 and updated record
- Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
- Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

**DELETE api/users/{userId}** - to delete existing user from database
- Server should answer with status code 204 if the record is found and deleted
- Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
- Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
