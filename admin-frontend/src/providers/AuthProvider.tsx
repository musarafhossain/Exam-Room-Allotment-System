"use client";

import React, { useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import { AuthContext, AuthContextType } from "contexts/AuthContext";
import { UserModel } from "models";
import { AuthService } from "services";
import { STORAGE_KEYS } from "helpers/constant";

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = STORAGE_KEYS.JWT;
const USER_KEY = STORAGE_KEYS.USER;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const getMe = useCallback(async () => {
    try {
      const res = await AuthService.getMe();
      if (res.success) {
        setUser(res.data!);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data!));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Load from local storage and validate on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user", e);
        }
      }
      getMe();
    } else {
      setLoading(false);
    }
  }, [getMe]);

  const login = useCallback((userData: UserModel, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const updateUser = useCallback((userData: Partial<UserModel>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const isAuthenticated = useMemo(() => !!token, [token]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      token,
      loading,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated, token, loading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
