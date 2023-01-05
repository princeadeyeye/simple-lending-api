import { HttpException } from '@exceptions/HttpException';
import { Accounts } from '@/models/accounts.model';
import { Transactions } from '@/models/transactions.model';
import { v4 as uuid } from 'uuid';

import { Account } from '@/interfaces/accounts.interface';
import { Transaction, TransactionRequest } from '@/interfaces/transactions.interface';

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

  public async findTransactionByUserId(id: string): Promise<Transaction> {
    const transaction = await Transactions.query().select().from('transactions').where('transactionId', '=', id).first();
    return transaction;
  }

  public async withdraw(
    userId: string,
    amount: number,
    transactionId: string,
  ): Promise<{ status: number; error: boolean; data: number; message: string }> {
    if (amount < 1) return { status: 400, error: true, data: null, message: `Invalid input amount` };
    const account = await this.findAccountsByUserId(userId);
    if (amount > account.accountBalance) return { status: 400, error: true, data: null, message: `Invalid input amount` };
    const newBalance = account.accountBalance - amount;
    const updatedBalance = await this.updateBalance(newBalance, userId, transactionId);
    return { status: 201, error: false, data: null, message: `${amount} Withdraw successfully, Balance ${updatedBalance}` };
  }

  public async receive(
    userId: string,
    amount: number,
    transactionId?: string,
  ): Promise<{ status: number; error: boolean; data: number; message: string }> {
    if (amount < 1) return { status: 409, error: true, data: null, message: `Invalid input amount` };
    const account = await this.findAccountsByUserId(userId);
    if (!account) return { status: 409, error: true, data: null, message: `User not found` };
    const newBalance = account.accountBalance + amount;
    const updatedBalance = await this.updateBalance(newBalance, userId, transactionId);
    return { status: 201, error: false, data: updatedBalance, message: `Receive successfully` };
  }

  public async transfer(amount: number, userId: string, recieverId: string, transactionId?: string) {
    if (amount < 1) return { status: 409, error: true, data: null, message: `Invalid input amount` };
    const account = await this.findAccountsByUserId(userId);
    if (!account) return { status: 409, error: true, data: null, message: `User is not found` };
    if (amount > account.accountBalance) return { status: 400, error: true, data: null, message: `Insufficient Funds` };
    const sendMoney = await this.receive(recieverId, amount, transactionId);
    if (sendMoney.error) return { status: 400, error: true, data: null, message: `Failed to send money` };
    const newBalance = account.accountBalance - amount;
    const updatedBalance = await this.updateBalance(newBalance, userId, transactionId);
    return { status: 201, error: false, data: updatedBalance, message: `Successfully send money` };
  }

  public async updateBalance(newBalance: number, userId: string, transactionId?: string): Promise<number> {
    if (newBalance < 0) throw new HttpException(409, 'Account balance cannot be negative');
    await Accounts.query().update({ accountBalance: newBalance }).where('userId', '=', userId).into('accounts');
    await this.updateTransaction(transactionId);
    return newBalance;
  }
  public async createAccountsLogs(request: TransactionRequest): Promise<string> {
    const debitCustomerId = await this.findAccountsByUserId(request.payeeUserId);
    let creditCustomerId = null;
    if (request.receiverUserId) creditCustomerId = await this.findAccountsByUserId(request.receiverUserId);
    const transaction: Transaction = {
      transactionId: uuid(),
      amount: request.amount,
      naration: request.naration,
      status: 'INITITATED',
      debitAccountPreviousBalance: debitCustomerId.accountBalance,
      creditAccountPreviousBalance: creditCustomerId?.accountBalance ?? null,
      debitAccountNewBalance: debitCustomerId.accountBalance,
      creditAccountNewBalance: debitCustomerId.accountBalance,
      debitWalletId: debitCustomerId.userId,
      creditWalletId: creditCustomerId?.userId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await Transactions.query().insert(transaction).into('transactions');
    return transaction.transactionId;
  }

  public async updateTransaction(transactionId: string): Promise<void> {
    const transaction = await Transactions.query().select().from('transactions').where('transactionId', '=', transactionId).first();
    if (!transaction) throw new HttpException(409, "Transaction doesn't exist");
    const debitAccount = await this.findAccountsByUserId(transaction.debitWalletId);
    let creditAccount = null;
    if (transaction.creditWalletId) creditAccount = await this.findAccountsByUserId(transaction.creditWalletId);
    await Transactions.query()
      .update({
        debitAccountNewBalance: debitAccount.accountBalance,
        creditAccountNewBalance: creditAccount?.accountBalance ?? null,
        updatedAt: new Date(),
        status: 'COMPLETED',
      })
      .where('id', '=', transaction.id)
      .into('transactions');
  }

  public createTransactionObject(payeeUserId: string, amount: number, naration: string, receiverUserId?: string): TransactionRequest {
    const transaction: TransactionRequest = {
      payeeUserId,
      naration,
      amount,
      receiverUserId,
    };
    return transaction;
  }
}

export default AccountService;
