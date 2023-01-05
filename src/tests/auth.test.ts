import request from 'supertest';
import App from '@/app';
import { CreateUserDto, LoginDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';
import { generateAccountNumber } from '@utils/util';

const accountNumber = generateAccountNumber().toString();
let userId = null;
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: `test${accountNumber}@email.com`,
        password: 'q1w2e3r4',
        firstname: 'muiz',
        lastname: 'ade',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return await request(app.getServer()).post('/signup').send(userData).expect(201);
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
      return await request(app.getServer())
        .post('/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });
});
