import request from 'supertest';
import { service } from '../src/app';
import { correctNewUserParam, correctUpdatedUserParam } from './mockData';


describe('First scenario: positive cases with user', function () {
  const server = service.getServer();
  let userId = undefined;

  afterAll(() => {
    service.close();
  });

  it('return empty array of users', async () => {
    await request(server).get('/api/users').expect(200, []);
  });

  it('return new record of user with id', async () => {
    const res = await request(server).post('/api/users').send(correctNewUserParam);

    expect(res.status).toEqual(201);
    expect(res.body).toMatchObject(correctNewUserParam);
    expect(res.body).toMatchObject({id: expect.any(String)});
    userId = res.body.id;
  });

  it('update user with id', async () => {
    const res = await request(server).put(`/api/users/${userId}`).send(correctUpdatedUserParam);

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(correctUpdatedUserParam);
    expect(res.body).toMatchObject({id: userId});
  });

  it('delete user with id', async () => {
    const res = await request(server).delete(`/api/users/${userId}`).send();

    expect(res.status).toEqual(204);
    !expect(res.body);
  });

  it('find user with id after deleting', async () => {
    const res = await request(server).get(`/api/users/${userId}`).send();

    expect(res.status).toEqual(404);
    !expect(res.body);
    userId = undefined;
  });

  it('return empty array of users after deleting', async () => {
    await request(server).get('/api/users').expect(200, []);
  });
});
