import request from 'supertest';
import { service } from '../src/app';
import { Messages } from '../src/service/constants';
import { correctNewUserParam, correctUpdatedUserParam } from './mockData';


describe('First scenario: positive cases with user', function () {
  const server = service.getServer();
  let userId = undefined;
  let userData = correctUpdatedUserParam;

  afterAll(() => {
    service.close();
  });

  it('create new user and return record with id', async () => {
    const res = await request(server).post('/api/users').send(correctNewUserParam);

    expect(res.status).toEqual(201);
    expect(res.body).toMatchObject(correctNewUserParam);
    expect(res.body).toMatchObject({id: expect.any(String)});
    userId = res.body.id;
  });

  it('update user with id: update age and hobbies)', async () => {
    const res = await request(server).put(`/api/users/${userId}`).send(userData);

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(userData);
    expect(res.body).toMatchObject({id: userId});
  });

  it('update user with id: update username', async () => {
    const newUserData = {...userData};
    newUserData['username'] = 'Anna';
    const res = await request(server).put(`/api/users/${userId}`).send(newUserData);

    expect(res.status).toEqual(200);
    expect(res.body).not.toMatchObject(userData);
    expect(res.body).toMatchObject(newUserData);
    expect(res.body).toMatchObject({id: userId});

    userData = newUserData;
  });

  it('update user with id: update username and set empty hobbies', async () => {
    const newUserData = {...userData};
    newUserData['username'] = 'Oleg';
    newUserData['hobbies'] = [];
    const res = await request(server).put(`/api/users/${userId}`).send(newUserData);

    expect(res.status).toEqual(200);
    expect(res.body).not.toMatchObject(userData);
    expect(res.body).toMatchObject(newUserData);
    expect(res.body).toMatchObject({id: userId});

    userData = newUserData;
  });

  it('update user with id: set old values', async () => {
    const res = await request(server).put(`/api/users/${userId}`).send(userData);

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(userData);
    expect(res.body).toMatchObject({id: userId});
  });

  it('update user with id: set invalid id with incorrect length', async () => {
    const res = await request(server).put(`/api/users/${userId}1`).send(userData);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidUserId);
  });

  it('update user with id: set invalid id with incorrect symbol', async () => {
    const invalidUserId = '?' + userId.slice(1);
    const res = await request(server).put(`/api/users/${invalidUserId}`).send(userData);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidUserId);

    await request(server).delete(`/api/users/${userId}`).send();
  });
});
