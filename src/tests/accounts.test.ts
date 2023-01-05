import request from 'supertest';
import App from '@/app';
import { DepositMoney, TransferMoney, WithdrawMoney } from '@dtos/accounts.dto';
import AccountsRoute from '@routes/accounts.route';
import assert from 'assert';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
});

describe('Testing Accounts', () => {
  describe('Testing Authentication and Authorization', () => {
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
  describe('Testing Authentication with expired token', () => {
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
    it('should deposit money successfully', async () => {
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
    it('should fail to deposit negative value', async () => {
      const userData: DepositMoney = {
        email: 'test1150633084@email.com',
        amount: -20,
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
        .expect(400);
    });
    it('should fail to deposit zero value', async () => {
      const userData: DepositMoney = {
        email: 'test1150633084@email.com',
        amount: 0,
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
        .expect(400);
    });
    it('should fail to deposit mismatch email and token', async () => {
      const userData: DepositMoney = {
        email: 'test4074086358@email.com',
        amount: 300,
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
        .expect(409);
    });
    it('should fail to deposit invalid email and token', async () => {
      const userData: DepositMoney = {
        email: 'test4074086358t1@email.com',
        amount: 300,
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
        .expect(401);
    });
  });
  describe('[POST] /accounts/withdraw', () => {
    it('Should Withdraw Money Successfully', async () => {
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
    it('should fail to withdraw negative values', async () => {
      const userData: WithdrawMoney = {
        email: 'test1150633084@email.com',
        amount: -200,
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
        .expect(400);
    });
    it('should fail to Withdraw zero value', async () => {
      const userData: WithdrawMoney = {
        email: 'test1150633084@email.com',
        amount: 0,
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
        .expect(400);
    });
    it('should fail to withdraw with right token wrong email', async () => {
      const userData: WithdrawMoney = {
        email: 'test4074086358@email.com',
        amount: 80,
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
        .expect(409);
    });
    it('should fail to withdraw with right token invalid email', async () => {
      const userData: WithdrawMoney = {
        email: 'test4074086358t3@email.com',
        amount: 80,
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
        .expect(401);
    });
  });
  describe('[GET] /accounts/transfer', () => {
    it('shhould transfer money successfully', async () => {
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
    it('should failed to transfer negative value / Bad Request', async () => {
      const userData: TransferMoney = {
        email: 'test1150633084@email.com',
        amount: -10,
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
        .expect(400);
    });
    it('should failed to transfer zero value', async () => {
      const userData: TransferMoney = {
        email: 'test1150633084@email.com',
        amount: 0,
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
        .expect(400);
    });
    it('should failed to transfer with mismatch email', async () => {
      const userData: TransferMoney = {
        email: 'test4074086358@email.com',
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
        .expect(409);
    });
    it('should failed to transfer with invalid email', async () => {
      const userData: TransferMoney = {
        email: 'test4074086358p5@email.com',
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
        .expect(401);
    });
  });
  describe('[POST] /accounts/showbalance', () => {
    it('Balance must be postive value', async () => {
      const accountRoute = new AccountsRoute();
      const route = `${accountRoute.path}showbalance`;
      const app = new App([accountRoute]);
      return await request(app.getServer())
        .get(route)
        .set('Accept', 'application/json')
        .set(
          'Cookie',
          'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY3MjkyMTM5NiwiZXhwIjoxNjcyOTU3MzgyfQ.hT8pENN-c8fBtgyrpxkVZINi4q8uqtylAkTRmhnDDEA',
        )
        .expect(200);
    });
  });
});
