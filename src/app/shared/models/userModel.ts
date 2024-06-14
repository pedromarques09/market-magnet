export interface UserModel {
  _id?: number;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
