import { HttpException } from '@exceptions/HttpException';
import { Accounts } from '@/models/accounts.model';
import { Account } from '@/interfaces/accounts.interface';

class AccountService {
  public async findAccountsByEmail(accountEmail: string): Promise<Account> {
    const findAccount: Account = await Accounts.query().select().from('accounts').where('accountEmail', '=', accountEmail).first();
    return findAccount;
  }

  public async findAccountsByAccountNumber(accountNumber: string): Promise<Account> {
    const findAccount: Account = await Accounts.query().select().from('accounts').where('accountNumber', '=', accountNumber).first();
    return findAccount;
  }

  public async findAccountsByUserId(id: string): Promise<Account> {
    const findAccount: Account = await Accounts.query().select().from('accounts').where('userId', '=', id).first();
    return findAccount;
  }

  public async withdraw(userId: string, amount: number): Promise<{ status: number; error: boolean; data: number; message: string }> {
    if (amount < 1) return { status: 400, error: true, data: null, message: `Invalid input amount` };
    const account = await this.findAccountsByUserId(userId);
    if (amount > account.accountBalance) return { status: 400, error: true, data: null, message: `Invalid input amount` };
    const newBalance = account.accountBalance - amount;
    const updatedBalance = await this.updateBalance(newBalance, userId);
    return { status: 201, error: false, data: null, message: `${amount} Withdraw successfully, Balance ${updatedBalance}` };
  }

  public async receive(userId: string, amount: number): Promise<{ status: number; error: boolean; data: number; message: string }> {
    if (amount < 1) return { status: 409, error: true, data: null, message: `Invalid input amount` };
    const account = await this.findAccountsByUserId(userId);
    if (!account) return { status: 409, error: true, data: null, message: `User not found` };
    const newBalance = account.accountBalance + amount;
    const updatedBalance = await this.updateBalance(newBalance, userId);
    return { status: 201, error: false, data: updatedBalance, message: `Receive successfully` };
  }

  public async transfer(amount: number, userId: string, accountNumber: string) {
    if (amount < 1) return { status: 409, error: true, data: null, message: `Invalid input amount` };
    const account = await this.findAccountsByUserId(userId);
    if (!account) return { status: 409, error: true, data: null, message: `User is not found` };
    const reveiver = await this.findAccountsByAccountNumber(accountNumber);
    if (!reveiver) return { status: 409, error: true, data: null, message: `Wrong Account number` };
    if (amount > account.accountBalance) return { status: 400, error: true, data: null, message: `Insufficient Funds` };
    const sendMoney = await this.receive(reveiver.userId, amount);
    if (sendMoney.error) return { status: 400, error: true, data: null, message: `Failed to send money to ${accountNumber}` };
    const newBalance = account.accountBalance - amount;
    const updatedBalance = await this.updateBalance(newBalance, userId);
    return { status: 201, error: false, data: updatedBalance, message: `Successfully send money to ${accountNumber}` };
  }

  public async updateBalance(newBalance: number, userId: string): Promise<number> {
    if (newBalance < 0) throw new HttpException(409, 'Account balance cannot be negative');
    await Accounts.query().update({ accountBalance: newBalance }).where('userId', '=', userId).into('accounts');
    return newBalance;
  }
}

export default AccountService;
