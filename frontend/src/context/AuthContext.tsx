import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gdg_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('gdg_admin_token');
      if (storedToken) {
        try {
          const profile = await apiService.getMe();
          setAdmin(profile);
          setToken(storedToken);
        } catch (err) {
          console.error("Session expired or invalid:", err);
          localStorage.removeItem('gdg_admin_token');
          setAdmin(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const data = await apiService.login(credentials);
    localStorage.setItem('gdg_admin_token', data.access_token);
    setToken(data.access_token);
    setAdmin(data.admin);
  };

  const logout = () => {
    if (localStorage.getItem('gdg_admin_token')) {
      apiService.logout().catch(() => {
        // Ignore network/expiry errors during logout cleanup
      });
    }
    localStorage.removeItem('gdg_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
