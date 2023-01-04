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
      this.authService.checkAuthorization(user.uniqueId, account.userId);
      await this.accountService.receive(account.userId, amount);
      return res.json({ status: 201, error: false, message: `${amount} has been deposited successfully` });
    } catch (error) {
      next(error);
    }
  };

  public transafer = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const email = req.body.email;
      const account = await this.accountService.findAccountsByEmail(email);
      this.authService.checkAuthorization(user.uniqueId, account.userId);
      const receiverAccountNumber = req.body.accountNumber;
      const amount = parseFloat(req.body.amount);
      this.accountService.transfer(amount, user.uniqueId, receiverAccountNumber);
      return res.json({ status: 201, error: false, message: `${amount} has been transfer successfully` });
    } catch (error) {
      next(error);
    }
  };

  public withdraw = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const email = req.body.email;
      const account = await this.accountService.findAccountsByEmail(email);
      this.authService.checkAuthorization(user.uniqueId, account.userId);
      const amount = parseFloat(req.body.amount);
      this.accountService.withdraw(user.uniqueId, amount);
      return res.json({ status: 201, error: false, message: `${amount} has been withdraw successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export default AccountController;
