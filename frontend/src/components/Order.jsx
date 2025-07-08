import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        alert('Failed to fetch Orders. Please try again later.');
        console.error('Failed to fetch Orders:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching Orders:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='w-full h-full flex flex-col p-4 gap-4'>
      <h1 className='text-2xl font-bold'>Orders</h1>

      <input
        type='text'
        placeholder='Search by product name...'r
        className='border p-2 w-1/3 rounded'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        <table className='w-full border-collapse border border-gray-300 mt-4'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 p-2'>S No</th>
              <th className='border border-gray-300 p-2'>Product Name</th>
              <th className='border border-gray-300 p-2'>Category Name</th>
              <th className='border border-gray-300 p-2'>Quantity</th>
              <th className='border border-gray-300 p-2'>Total Price</th>
              <th className='border border-gray-300 p-2'>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) =>
                order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((order, index) => (
                <tr key={order._id}>
                  <td className='border p-2'>{index + 1}</td>
                  <td className='border p-2'>{order.product?.name || 'N/A'}</td>
                  <td className='border p-2'>{order.product?.categoryId?.categoryName }</td>
                  <td className='border p-2'>{order.quantity}</td>
                  <td className='border p-2'>₦{order.totalPrice}</td>
                  <td className='border p-2'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
