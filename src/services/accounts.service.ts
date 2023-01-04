import { HttpException } from '@exceptions/HttpException';
import { Accounts } from '@/models/accounts.model';
import { Account } from '@/interfaces/accounts.interface';

class UserService {
  public async findAccountsByEmail(accountEmail: string): Promise<Account> {
    const findAccount: Account = await Accounts.query().select().from('accounts').where('email', '=', accountEmail).first();
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

  public async withdraw(userId: string, amount: number): Promise<number> {
    if (amount < 1) throw new HttpException(409, 'invalid amount entered');
    const account = await this.findAccountsByUserId(userId);
    if (amount > account.accountBalance) throw new HttpException(409, 'invalid amount entered');
    const newBalance = account.accountBalance - amount;
    this.updateBalance(newBalance, userId);
    return newBalance;
  }

  public async receive(userId: string, amount: number): Promise<number> {
    if (amount < 1) throw new HttpException(409, 'invalid amount entered');
    const account = await this.findAccountsByUserId(userId);
    const newBalance = account.accountBalance + amount;
    this.updateBalance(newBalance, userId);
    return newBalance;
  }

  public async transfer(amount: number, userId: string, accountNumber: string) {
    if (amount < 1) throw new HttpException(409, 'invalid amount entered');
    const account = await this.findAccountsByUserId(userId);
    const reveiver = await this.findAccountsByAccountNumber(accountNumber);
    if (amount > account.accountBalance) throw new HttpException(409, 'insufficient funds');
    await this.receive(reveiver.userId, amount);
    const newBalance = account.accountBalance - amount;
    this.updateBalance(newBalance, userId);
    return newBalance;
  }

  public async updateBalance(newBalance: number, userId: string): Promise<number> {
    if (newBalance < 0) throw new HttpException(409, 'Account balance cannot be negative');
    await Accounts.query().update({ accountBalance: newBalance }).where('userId', '=', userId).into('accounts');
    return newBalance;
  }
}

export default UserService;
