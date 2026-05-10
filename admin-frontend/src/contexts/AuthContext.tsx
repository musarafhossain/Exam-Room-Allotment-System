"use client";

import { createContext } from "react";
import { UserModel } from "models";

export interface AuthContextType {
  user: UserModel | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (userData: UserModel, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserModel>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
