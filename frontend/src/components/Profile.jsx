import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });

      if (response.data.success) {
        const { name, email, address, password } = response.data.user;
        setUser({ name, email, address, password });
      } else {
        console.error('Error fetching user:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:3000/api/users/profile',
        user,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );

      if (response.data.success) {
        alert('Profile updated successfully!');
        setEdit(false);
        fetchUser(); // Refresh user data after update
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='p-5'>
      <h2 className='font-bold text-2xl mb-4'>Profile</h2>

      <form className='bg-white p-6 rounded-lg shadow max-w-md' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
          <input 
            type="text" 
            name="name"
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            disabled={!edit}
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300' 
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
          <input 
            type="email" 
            name="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            disabled={!edit}
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300' 
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="address" className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
          <input 
            type="text" 
            name="address"
            id="address"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            disabled={!edit}
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300' 
          />
        </div>

        {edit && (
          <div className='mb-4'>
            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input 
              type="password" 
              name="password"
              id="password"
              placeholder='Enter new password (optional) '
              className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300'/>
          </div>
        )}
        {!edit ? (
        <button 
          type="submit"
          className='bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 cursor-pointer'
          onClick={() => setEdit(!edit)}
        >
          Edit Profile
        </button>
        ) : (
          <>  
          <button 
          type='submit' 
          className='bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-500 cursor-pointer'
          >
            Save Changes
          </button>
          <button 
            type="button"
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2'
            onClick={() => setEdit(false)}
          >
            Cancel
          </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Profile;
