import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {     
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: email.trim(),
        password: password
      });
      console.log(response.data);
      if (response.data.success) {
        await login(response.data.user, response.data.token);
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else  {
          navigate('/customer/dashboard');
        }
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-700 from-50% to-gray-100 to-50% space-y-6">
      <h2 className='text-3xl text-white'>Inventory Management System</h2>
      <div className='border shadow-lg p-6 w-80 bg-white rounded-lg'>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        {error && (
          <div className='bg-red-200 text-red-700 p-2 mb-4 rounded'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className='block text-gray-700'>Email:</label>
            <input 
              type="text" 
              className='w-full px-3 py-2 border' 
              placeholder='Enter email' 
              name="email" 
              required 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className='block text-gray-700'>Password:</label>
            <input 
              type="password" 
              className='w-full px-3 py-2 border' 
              placeholder='********' 
              name="password" 
              required 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <button 
              type="submit" 
              className='w-full bg-green-600 py-2 text-white'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;