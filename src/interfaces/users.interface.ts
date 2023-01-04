export interface User {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  uniqueId: string;
}

export interface UserReponse {
  email: string;
  fullname: string;
  accountNumber: string;
}
