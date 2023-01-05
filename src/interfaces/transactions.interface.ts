export interface Transaction {
  id?: number;
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
}

export interface TransactionRequest {
  payeeUserId: string;
  receiverUserId?: string;
  amount: number;
  naration: string;
}
