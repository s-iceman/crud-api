import request from 'supertest';
import { service } from '../src/app';
import { Messages } from '../src/service/constants';
import { correctNewUserParam } from './mockData';


describe('First scenario: positive cases with user', function () {
  const server = service.getServer();
  let userId = undefined;

  afterAll(() => {
    service.close();
  });

  it('create new user without username', async () => {
    const res = await request(server).post('/api/users').send({
      hobbies: [],
      age: 10
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user without hobbides', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'Anna',
      age: 10
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user without age', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'Anna',
      hobbies: []
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user with invalid type of username', async () => {
    const res = await request(server).post('/api/users').send({
      username: '',
      age: 13,
      hobbies: []
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user with invalide type of age', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'Anna',
      age: '13',
      hobbies: []
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });


  it('create new user with invalid type of hobbies', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'Anna',
      age: 13,
      hobbies: {}
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user with invalid type of one hobbie', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'Anna',
      age: 13,
      hobbies: ['math', 13]
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user with additional field', async () => {
    const res = await request(server).post('/api/users').send({
      username: 'Anna',
      age: 13,
      hobbies: [],
      job: 'singer'
    });

    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidParams);

    await request(server).get('/api/users').expect(200, []);
  });

  it('create new user with invalid endpoint', async () => {
    const res = await request(server).post('/api/hello').send({
      username: 'Anna',
      age: 13,
      hobbies: [],
    });

    expect(res.status).toEqual(404);
    expect(res.body).toEqual(Messages.AddressNotFound);

    await request(server).get('/api/users').expect(200, []);
  });

  it('get users with invalid endpoint', async () => {
    let res = await request(server).get('/api/hello').send();
    expect(res.status).toEqual(404);
    expect(res.body).toEqual(Messages.AddressNotFound);

    res = await request(server).get('/api').send();
    expect(res.status).toEqual(404);
    expect(res.body).toEqual(Messages.AddressNotFound);

    res = await request(server).get('/api/user').send();
    expect(res.status).toEqual(404);
    expect(res.body).toEqual(Messages.AddressNotFound);

    res = await request(server).get('/api/users/hello').send();
    expect(res.status).toEqual(400);
    expect(res.body).toEqual(Messages.InvalidUserId);
  });

});
