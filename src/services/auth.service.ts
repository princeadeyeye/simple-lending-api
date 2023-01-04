import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, LoginResponseData, TokenData } from '@interfaces/auth.interface';
import { User, UserReponse } from '@interfaces/users.interface';
import { Users } from '@models/users.model';
import { Accounts } from '@models/accounts.model';
import { generateAccountNumber, isEmpty } from '@utils/util';
import { v4 as uuid } from 'uuid';

class AuthService {
  public async signup(userData: CreateUserDto): Promise<UserReponse> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: Users = await Users.query().select().from('users').where('email', '=', userData.email).first();
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const userId = uuid();
    let accountNumber = null;
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await Users.query()
      .insert({ ...userData, password: hashedPassword, uniqueId: userId })
      .into('users');
    if (createUserData) {
      accountNumber = generateAccountNumber().toString();
      const createdAt = new Date();
      const updatedAt = new Date();
      await Accounts.query()
        .insert({
          userId,
          accountNumber,
          createdAt,
          updatedAt,
          accountEmail: userData.email,
          accountName: `${userData.lastname} ${userData.firstname}`,
        })
        .into('accounts');
    }
    const data: UserReponse = {
      email: createUserData.email,
      fullname: `${createUserData.lastname} ${createUserData.firstname}`,
      accountNumber,
    };
    return data;
  }

  public async login(userData: CreateUserDto): Promise<LoginResponseData> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await Users.query().select().from('users').where('email', '=', userData.email).first();
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, token: tokenData.token };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await Users.query()
      .select()
      .from('users')
      .where('email', '=', userData.email)
      .andWhere('password', '=', userData.password)
      .first();

    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
  public checkAuthorization(tokenUserId: string, userId: string): void {
    const authorized = tokenUserId === userId;
    if (!authorized) throw new HttpException(401, "User doesn't exist");
  }
}

export default AuthService;
