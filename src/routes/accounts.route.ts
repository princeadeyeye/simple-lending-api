import { Router } from 'express';
import AccountController from '@/controllers/accounts.controller';
import { WithdrawMoney, TransferMoney, DepositMoney } from '@dtos/accounts.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AccountRoute implements Routes {
  public path = '/account';
  public router = Router();
  public accountController = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}deposit`, authMiddleware, validationMiddleware(DepositMoney, 'body', true), this.accountController.deposit);
    this.router.post(`${this.path}transfer`, authMiddleware, validationMiddleware(TransferMoney, 'body', true), this.accountController.transafer);
    this.router.post(`${this.path}withdraw`, authMiddleware, validationMiddleware(WithdrawMoney, 'body', true), this.accountController.withdraw);
  }
}

export default AccountRoute;
