import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/AppModule';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const responses: Record<string, any> = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ------------------------------------- AUTH MICROSERVICE ------------------------------------- //

  it('Registration: should return User credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@domain.com', password: '123456789', passwordConfirmation: '123456789' })
      .expect(201);
  });

  it('Login: should return User credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'root@domain.com', password: '123456789' })
      .expect(201)
      .then((value) => (responses.newUser = value.body));
  });

  it('Get Users: should return Users list', () => {
    return request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${responses.token}`).expect(200);
  });

  it('Store User: should return new User', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${responses.token}`)
      .send({ email: 'newUser@domain.com', password: '123456789', name: 'TEST' })
      .expect(201)
      .then((value) => (responses.newUser = value.body));
  });

  it('Edit User: should return One User', () => {
    return request(app.getHttpServer())
      .get(`/users/${responses.newUser.uuid}`)
      .set('Authorization', `Bearer ${responses.token}`)
      .expect(200);
  });

  it('Update User: should return "User updated successfully"', () => {
    return request(app.getHttpServer())
      .put(`/users`)
      .set('Authorization', `Bearer ${responses.token}`)
      .send({ uuid: responses.newUser.uuid, email: responses.newUser.email, name: 'New Name', role: 'admin' })
      .expect(200, 'User updated successfully');
  });

  it('Delete User: should return "User deleted successfully"', () => {
    return request(app.getHttpServer())
      .put(`/users/${responses.newUser.uuid}`)
      .set('Authorization', `Bearer ${responses.token}`)
      .expect(200, 'User deleted successfully');
  });

  // ------------------------------------- ARTICLE MICROSERVICE ------------------------------------- //

  /*it('Get Articles: should return Article list', () => {
    return request(app.getHttpServer())
      .put(`/users/${responses.newUser.uuid}`)
      .set('Authorization', `Bearer ${responses.token}`)
      .expect(200, 'User deleted successfully');
  });*/
});
