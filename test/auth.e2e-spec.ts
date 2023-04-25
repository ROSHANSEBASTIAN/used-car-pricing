import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication testing', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'irene@gmail.com', password: 'jilson' })
      .expect(201)
      .then((res) => {
        const { email, id } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual('irene@gmail.com');
      });
  });

  it('Signup as a new user and get the currently new logged in user.', async () => {
    const newEmail = 'asgf@gmail.com';

    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: newEmail, password: 'asdf' })
      .expect(201);

    const rxdCookie = signupResponse.get('Set-Cookie'); // storing the cookie in a variable to use in login process later

    const signinResp = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set({ Cookie: rxdCookie })
      .expect(200);

    expect(signinResp.body.email).toEqual(newEmail);
  });
});
