import { Transaction, TransactionRequest } from '@/interfaces/transactions.interface';
import { v4 as uuid } from 'uuid';
import { Transactions } from '@/models/transactions.model';

class UserService {
  public async createAccountsLogs(request: TransactionRequest): Promise<string> {
    const transaction: Transaction = {
      transactionId: uuid(),
      amount: request.amount,
      naration: '',
      status: 'INITIATED',
      debitAccountPreviousBalance: 0,
      creditAccountPreviousBalance: 0,
      debitAccountNewBalance: 0,
      creditAccountNewBalance: 0,
      debitWalletId: '',
      creditWalletId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await Transactions.query().insert(transaction).into('transactions');
    return transaction.transactionId;
  }
}

export default UserService;
