import { IsEmail, IsNumber, IsString } from 'class-validator';

export class WithdrawMoney {
  @IsEmail()
  public email: string;

  @IsNumber()
  public amount: number;
}

export class TransferMoney {
  @IsEmail()
  public email: string;

  @IsNumber()
  public amount: number;

  @IsString()
  public accountNumber: string;
}

export class DepositMoney {
  @IsEmail()
  public email: string;

  @IsNumber()
  public amount: number;
}
