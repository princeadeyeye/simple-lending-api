import { Model, ModelObject } from 'objection';
import { Transaction } from '@interfaces/transactions.interface';

export class Transactions extends Model implements Transaction {
  id: number;
  transactionId: string;
  amount: number;
  naration: string;
  status: string;
  debitAccountPreviousBalance: number;
  creditAccountPreviousBalance: number;
  debitAccountNewBalance: number;
  creditAccountNewBalance: number;
  debitWalletId: string;
  creditWalletId: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'transactions'; // database table name
  static idColumn = 'id'; // id column name
}

export type TransactionShape = ModelObject<Transactions>;
