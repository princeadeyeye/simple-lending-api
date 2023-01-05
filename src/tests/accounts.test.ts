import request from 'supertest';
import App from '@/app';
import { DepositMoney, TransferMoney, WithdrawMoney } from '@dtos/accounts.dto';
import AccountsRoute from '@routes/accounts.route';
import assert from 'assert';
import { LoginDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
});

describe('Testing Accounts', () => {
  describe('[POST] /accounts/withdraw', () => {
    it('response statusCode 404 / Authentication token missing', async () => {
      const userData: DepositMoney = {
        email: 'muizadeyeye@gmail.com',
        amount: 2000,
      };
      const accountRoute = new AccountsRoute();
      const route = `${accountRoute.path}withdraw`;
      const app = new App([accountRoute]);
      return await request(app.getServer())
        .post(route)
        .send(userData)
        .expect(404)
        .then(response => {
          assert(response.body, ' Authentication token missing');
        });
    });
  });
  describe('[POST] /accounts/withdraw', () => {
    it('response statusCode 401 / Wrong authentication token', async () => {
      const userData: DepositMoney = {
        email: 'muizadeyeye@gmail.com',
        amount: 2000,
      };
      const accountRoute = new AccountsRoute();
      const route = `${accountRoute.path}withdraw`;
      const app = new App([accountRoute]);
      return await request(app.getServer())
        .post(route)
        .set('Accept', 'application/json')
        .set(
          'Cookie',
          'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjcyODY5NDMxLCJleHAiOjE2NzI4NzMwMzF9.6I8gogTcyku7s5zSKhZy5O9kpbZ9n_O-9VhEyP-SSOE',
        )
        .send(userData)
        .expect(401)
        .then(response => {
          assert(response.body, ' Wrong authentication token');
        });
    });
  });

  describe('[POST] /accounts/deposit', () => {
    it('Deposit Money Successfully', async () => {
      const userData: DepositMoney = {
        email: 'test1150633084@email.com',
        amount: 2000,
      };
      const accountRoute = new AccountsRoute();
      const route = `${accountRoute.path}deposit`;
      const app = new App([accountRoute]);
      return await request(app.getServer())
        .post(route)
        .set('Accept', 'application/json')
        .set(
          'Cookie',
          'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY3MjkyMTM5NiwiZXhwIjoxNjcyOTU3MzgyfQ.hT8pENN-c8fBtgyrpxkVZINi4q8uqtylAkTRmhnDDEA',
        )
        .send(userData)
        .expect(201);
    });
  });
  describe('[POST] /accounts/withdraw', () => {
    it('Withdraw Money Successfully', async () => {
      const userData: WithdrawMoney = {
        email: 'test1150633084@email.com',
        amount: 200,
      };
      const accountRoute = new AccountsRoute();
      const route = `${accountRoute.path}withdraw`;
      const app = new App([accountRoute]);
      return await request(app.getServer())
        .post(route)
        .set('Accept', 'application/json')
        .set(
          'Cookie',
          'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY3MjkyMTM5NiwiZXhwIjoxNjcyOTU3MzgyfQ.hT8pENN-c8fBtgyrpxkVZINi4q8uqtylAkTRmhnDDEA',
        )
        .send(userData)
        .expect(201);
    });
  });
  describe('[POST] /accounts/transfer', () => {
    it('Transfer Money Successfully', async () => {
      const userData: TransferMoney = {
        email: 'test1150633084@email.com',
        amount: 200,
        accountNumber: '7554856508',
      };
      const accountRoute = new AccountsRoute();
      const route = `${accountRoute.path}transfer`;
      const app = new App([accountRoute]);
      return await request(app.getServer())
        .post(route)
        .set('Accept', 'application/json')
        .set(
          'Cookie',
          'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY3MjkyMTM5NiwiZXhwIjoxNjcyOTU3MzgyfQ.hT8pENN-c8fBtgyrpxkVZINi4q8uqtylAkTRmhnDDEA',
        )
        .send(userData)
        .expect(201);
    });
  });
});
