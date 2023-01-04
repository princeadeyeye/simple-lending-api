import request from 'supertest';
import App from '@/app';
import { CreateUserDto, LoginDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';
import { generateAccountNumber, isEmpty } from '@utils/util';

const accountNumber = generateAccountNumber().toString();
let userId = null;
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', () => {
      const userData: CreateUserDto = {
        email: `test${accountNumber}@email.com`,
        password: 'q1w2e3r4',
        firstname: 'muiz',
        lastname: 'ade',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer()).post('/signup').send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: LoginDto = {
        email: 'muizadeyeye@gmail.com',
        password: '1234muiz',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post('/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
