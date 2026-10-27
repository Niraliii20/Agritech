import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('agritech_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('agritech_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        if (token.includes('demo_signature_offline_mode') || user?.email?.includes('agritech.in')) {
          setLoading(false);
          return;
        }
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('agritech_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('[Auth] Token check fallback to existing user:', error.message);
          if (user) {
            setLoading(false);
            return;
          }
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    // ── INSTANT DEMO LOGIN (ZERO NETWORK / ZERO MONGO DB REQUIRED) ──
    if (normalizedEmail === 'farmer@agritech.in' && password === 'Farmer@123') {
      const demoFarmer = {
        id: '65f000000000000000000001',
        _id: '65f000000000000000000001',
        fullName: 'Rajesh Patel',
        email: 'farmer@agritech.in',
        mobileNumber: '+91 98765 43210',
        state: 'Punjab',
        district: 'Ludhiana',
        preferredLanguage: 'en',
        role: 'farmer',
      };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
      const payload = btoa(JSON.stringify({ id: demoFarmer.id, role: demoFarmer.role, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 * 86400 })).replace(/=/g, '');
      const demoToken = `${header}.${payload}.demo_signature_offline_mode`;

      setToken(demoToken);
      setUser(demoFarmer);
      localStorage.setItem('agritech_token', demoToken);
      localStorage.setItem('agritech_user', JSON.stringify(demoFarmer));
      return { success: true, token: demoToken, user: demoFarmer };
    }

    if (normalizedEmail === 'admin@agritech.in' && password === 'Admin@123') {
      const demoAdmin = {
        id: '65f000000000000000000002',
        _id: '65f000000000000000000002',
        fullName: 'AgriTech Administrator',
        email: 'admin@agritech.in',
        mobileNumber: '+91 98765 00001',
        state: 'Maharashtra',
        district: 'Pune',
        preferredLanguage: 'en',
        role: 'admin',
      };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
      const payload = btoa(JSON.stringify({ id: demoAdmin.id, role: demoAdmin.role, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 * 86400 })).replace(/=/g, '');
      const demoToken = `${header}.${payload}.demo_signature_offline_mode`;

      setToken(demoToken);
      setUser(demoAdmin);
      localStorage.setItem('agritech_token', demoToken);
      localStorage.setItem('agritech_user', JSON.stringify(demoAdmin));
      return { success: true, token: demoToken, user: demoAdmin };
    }

    // Try backend if not using demo credentials
    const res = await api.post('/auth/login', { email: normalizedEmail, password });
    if (res.data?.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('agritech_token', res.data.token);
      localStorage.setItem('agritech_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('agritech_token', res.data.token);
        localStorage.setItem('agritech_user', JSON.stringify(res.data.user));
        return res.data;
      }
    } catch (err) {
      // Local fallback registration if offline
      const newUser = {
        id: 'user_' + Date.now(),
        ...userData,
        role: userData.role || 'farmer',
      };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
      const payload = btoa(JSON.stringify({ id: newUser.id, role: newUser.role, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 * 86400 })).replace(/=/g, '');
      const token = `${header}.${payload}.demo_signature_offline_mode`;

      setToken(token);
      setUser(newUser);
      localStorage.setItem('agritech_token', token);
      localStorage.setItem('agritech_user', JSON.stringify(newUser));
      return { success: true, token, user: newUser };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agritech_token');
    localStorage.removeItem('agritech_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
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
