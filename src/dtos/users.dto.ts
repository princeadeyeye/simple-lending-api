import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({ message: 'Wrong Email Address' })
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public firstname: string;

  @IsString()
  public lastname: string;
}

export class LoginDto {
  @IsEmail({ message: 'Wrong Email Address' })
  public email: string;

  @IsString()
  public password: string;
}
