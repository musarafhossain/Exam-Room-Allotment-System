import { BaseModel } from "./Base.Models";

export default class UserModel extends BaseModel {
  public name?: string;
  public email!: string;
  public password!: string;
}

export interface AuthState {
  user: UserModel | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}
