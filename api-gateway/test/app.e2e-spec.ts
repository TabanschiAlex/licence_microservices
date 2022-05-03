import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/AppModule';

jest.setTimeout(60000);

describe('MICROSERVICE TESTS (e2e)', () => {
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

  // ---------------------------------------------------------------------------------------------------------------- //
  // ----------------------------------------------- AUTH MICROSERVICE ---------------------------------------------- //
  // ---------------------------------------------------------------------------------------------------------------- //

  it('Registration: should return User credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@domain.com', password: '123456789', passwordConfirmation: '123456789' })
      .expect(201);
  });

  it('Login: should return User credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@domain.com', password: '123456789' })
      .expect(201);
    responses.credentials = response.body;

    return response;
  });

  it('Get Users: should return Users list', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .expect(200);
  });

  it('Store User: should return new User', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({ email: 'newUser@domain.com', password: '123456789', name: 'TEST' })
      .expect(201);
    responses.newUser = response.body;

    return response;
  });

  it('Edit User: should return One User', async () => {
    return request(app.getHttpServer())
      .get(`/users/${responses.newUser.uuid}`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .expect(200);
  });

  it('Update User: should return "User updated successfully"', async () => {
    return request(app.getHttpServer())
      .put(`/users`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({ uuid: responses.newUser.uuid, email: responses.newUser.email, name: 'New Name', role: 'admin' })
      .expect(200, 'User updated successfully');
  });

  it('Delete User: should return "User deleted successfully"', async () => {
    return request(app.getHttpServer())
      .delete(`/users/${responses.newUser.uuid}`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .expect(200, 'User deleted successfully');
  });

  // ---------------------------------------------------------------------------------------------------------------- //
  // --------------------------------------------- ARTICLE MICROSERVICE --------------------------------------------- //
  // ---------------------------------------------------------------------------------------------------------------- //

  it('Get Articles: should return Article list', async () => {
    return request(app.getHttpServer()).get('/articles').expect(200);
  });

  it('Store Article: should return new Article', async () => {
    const response = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({ title: 'Test article', description: 'supertest', text: 'Article created by supertest' })
      .expect(201);
    responses.newArticle = response.body;

    return response;
  });

  it('Edit Article: should return One Article', async () => {
    return request(app.getHttpServer()).get(`/articles/${responses.newArticle.id}`).expect(200);
  });

  it('Update Article: should update article', async () => {
    return request(app.getHttpServer())
      .put(`/articles`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({
        id: responses.newArticle.id,
        title: 'Edited title',
        description: 'Edited description',
        text: 'Edited text',
      })
      .expect(200);
  });

  it('Delete Article: should delete article', async () => {
    return request(app.getHttpServer())
      .delete(`/articles/${responses.newArticle.id}`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .expect(200);
  });

  it('Create article for next request', async () => {
    const response = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({ title: 'Test article', description: 'supertest', text: 'Article created by supertest' })
      .expect(201);
    responses.newArticle = response.body;

    return response;
  });

  // ---------------------------------------------------------------------------------------------------------------- //
  // --------------------------------------------- REVIEW MICROSERVICE ---------------------------------------------- //
  // ---------------------------------------------------------------------------------------------------------------- //

  it('Get Reviews: should return Review list', async () => {
    return request(app.getHttpServer()).get('/reviews').expect(200);
  });

  it('Store Review: should return new Review', async () => {
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({ article_id: responses.newArticle.id, description: 'supertest', text: 'Review created by supertest' })
      .expect(201);
    responses.newReview = response.body;

    return response;
  });

  it('Edit Review: should return One Review', async () => {
    return request(app.getHttpServer()).get(`/reviews/${responses.newReview.id}`).expect(200);
  });

  it('Update Review: should update review', async () => {
    return request(app.getHttpServer())
      .put(`/reviews`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .send({
        id: responses.newReview.id,
        text: 'Edited review text',
      })
      .expect(200);
  });

  it('Delete Review: should delete review', async () => {
    return request(app.getHttpServer())
      .delete(`/reviews/${responses.newReview.id}`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .expect(200);
  });

  // ---------------------------------------------------------------------------------------------------------------- //
  // --------------------------------------------- DELETING TEST ACCOUNT -------------------------------------------- //
  // ---------------------------------------------------------------------------------------------------------------- //

  it('Delete Test account', async () => {
    return request(app.getHttpServer())
      .delete(`/users/${responses.credentials.user.uuid}`)
      .set('Authorization', `Bearer ${responses.credentials.token}`)
      .expect(200, 'User deleted successfully');
  });
});
