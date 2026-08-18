/**
 * Auth Context & Provider
 * Manages user authentication status, JWT token storage, login, register & demo quick-fill
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eventhub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('eventhub_token') || null);
  const [loading, setLoading] = useState(false);

  // Sync token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('eventhub_token', token);
    } else {
      localStorage.removeItem('eventhub_token');
    }
  }, [token]);

  // Sync user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('eventhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eventhub_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name, email, password, role = 'user', phone = '') => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password, role, phone });
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_user');
  };

  // Quick Demo Login Helper
  const loginAsDemoUser = async () => {
    return login('user@eventhub.com', 'userpassword123');
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@eventhub.com', 'adminpassword123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loginAsDemoUser,
        loginAsDemoAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
