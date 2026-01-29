import { User } from "./user.models";

export interface AuthResponse {
  user: User;
  token: string;
}