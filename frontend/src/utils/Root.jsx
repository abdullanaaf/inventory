import { useAuth } from '../context/AuthContext';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'customer') {
        navigate('/customer/dashboard');
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return null; // No UI to render, just redirecting
};

export default Root;
