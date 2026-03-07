// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? (JSON.parse(savedUser) as User) : null);
    } catch {
      setUser(null);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    try {
      // Mock login - in production, this would be a real API call
      if (email && password.length >= 6) {
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0],
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock registration
      if (name && email && password.length >= 6) {
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      // Mock account deletion
      localStorage.removeItem("user");
      localStorage.removeItem("scanHistory");
      setUser(null);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthReady, login, register, logout, deleteAccount, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
