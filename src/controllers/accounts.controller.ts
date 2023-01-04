import { NextFunction, Response } from 'express';
import AccountService from '@services/accounts.service';
import AuthService from '@/services/auth.service';
import { RequestWithUser } from '@interfaces/auth.interface';

class AccountController {
  accountService = new AccountService();
  authService = new AuthService();

  public deposit = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const email = req.body.email;
      const amount = parseFloat(req.body.amount);
      const account = await this.accountService.findAccountsByEmail(email);
      if (!account) return res.status(409).json({ status: 401, error: true, message: `${email} cannot deposit` });
      const isAuthorized = this.authService.checkAuthorization(user.uniqueId, account.userId);
      if (!isAuthorized) return res.status(401).json({ status: 401, error: true, message: `Authorization failed, ${email} cannot withdraw` });
      await this.accountService.receive(account.userId, amount);
      return res.json({ status: 201, error: false, message: `${amount} has been deposited successfully` });
    } catch (error) {
      next(error);
    }
  };

  public transfer = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const email = req.body.email;
      const account = await this.accountService.findAccountsByEmail(email);
      if (!account) return res.status(401).json({ status: 401, error: true, message: `${email} cannot withdraw` });
      const isAuthorized = this.authService.checkAuthorization(user.uniqueId, account.userId);
      if (!isAuthorized) return res.status(401).json({ status: 401, error: true, message: `Authorization failed, ${email} cannot withdraw` });
      const receiverAccountNumber = req.body.accountNumber;
      const amount = parseFloat(req.body.amount);
      const transferResponse = await this.accountService.transfer(amount, user.uniqueId, receiverAccountNumber);
      return res.status(transferResponse.status).json(transferResponse);
    } catch (error) {
      next(error);
    }
  };

  public withdraw = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const email = req.body.email;
      const account = await this.accountService.findAccountsByEmail(email);
      if (!account) return res.status(401).json({ status: 401, error: true, message: `${email} cannot withdraw` });
      const isAuthorized = this.authService.checkAuthorization(user.uniqueId, account.userId);
      if (!isAuthorized) return res.status(401).json({ status: 401, error: true, message: `Authorization failed, ${email} cannot withdraw` });
      const amount = parseFloat(req.body.amount);
      const withdrawResponse = await this.accountService.withdraw(user.uniqueId, amount);
      res.status(withdrawResponse.status).json(withdrawResponse);
    } catch (error) {
      next(error);
    }
  };

  public showBalance = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const account = await this.accountService.findAccountsByEmail(user.email);
      if (!account) return res.status(401).json({ status: 401, error: true, message: `${user.email} cannot view balance` });
      return res.status(200).json({ status: 200, data: account.accountBalance, error: false, message: `Account balance retrived successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export default AccountController;
