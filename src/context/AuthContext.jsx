import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('roamnexa_token'));

  useEffect(() => {
    if (token) {
      axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('roamnexa_token'); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('roamnexa_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await axios.post('/api/auth/register', { name, email, password, phone });
    localStorage.setItem('roamnexa_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('roamnexa_token');
    setToken(null);
    setUser(null);
  };

  const createBooking = async (bookingData) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post('/api/bookings', bookingData, { headers });
    return res.data;
  };

  const getMyBookings = async () => {
    const res = await axios.get('/api/bookings/my', { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, createBooking, getMyBookings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
