import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: '',
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        console.error('Error fetching users:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setFormData({
          name: '',
          email: '',
          password: '',
          address: '',
          role: '',
        });
        alert('User added successfully');
        fetchUsers(); // Refresh the list
      } else {
        alert(response.data.message || 'Error adding user');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Server error. Please contact administrator.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this User?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        });

        if (response.data.success) {
          alert('User deleted successfully');
          fetchUsers();
        } else {
          alert(response.data.message || 'Error deleting user');
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Error deleting user';
        alert(message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>User Management</h1>
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Form */}
        <div className='lg:w-1/3'>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <h2 className='text-center text-xl font-bold mb-4'>Add User</h2>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Enter Name'
                name='name'
                className='border w-full p-2 rounded-md'
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type='email'
                placeholder='Enter Email'
                className='border w-full p-2 rounded-md'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type='password'
                placeholder='**********'
                className='border w-full p-2 rounded-md'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type='text'
                placeholder='Enter Address'
                className='border w-full p-2 rounded-md'
                name='address'
                value={formData.address}
                onChange={handleChange}
                required
              />
              <select
                name='role'
                className='border w-full p-2 rounded-md'
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value=''>Select Role</option>
                <option value='admin'>Admin</option>
                <option value='customer'>Customer</option>
              </select>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full rounded-md p-3 text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Add User'}
              </button>
            </form>
          </div>
        </div>

        {/* Users Table */}
        <div className='lg:w-2/3'>
          <input
            type='text'
            placeholder='Search'
            className='w-full bg-white p-2 mb-4 rounded'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-200 p-2'>S No.</th>
                  <th className='border border-gray-200 p-2'>Name</th>
                  <th className='border border-gray-200 p-2'>Email</th>
                  <th className='border border-gray-200 p-2'>Address</th>
                  <th className='border border-gray-200 p-2'>Role</th>
                  <th className='border border-gray-200 p-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan='6' className='text-center py-4 text-gray-500'>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td className='border p-2'>{index + 1}</td>
                      <td className='border p-2'>{user.name}</td>
                      <td className='border p-2'>{user.email}</td>
                      <td className='border p-2'>{user.address}</td>
                      <td className='border p-2 capitalize'>{user.role}</td>
                      <td className='border p-2'>
                        <button
                          className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700'
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
