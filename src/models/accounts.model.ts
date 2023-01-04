import { Model, ModelObject } from 'objection';
import { Account } from '@interfaces/accounts.interface';

export class Accounts extends Model implements Account {
  id: number;
  userId: string;
  accountEmail: string;
  accountName: string;
  accountNumber: string;
  accountBalance: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'accounts'; // database table name
  static idColumn = 'id'; // id column name
}

export type AccountShape = ModelObject<Accounts>;
