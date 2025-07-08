import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const CustomerProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    productId: '',
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        alert('Failed to fetch products. Please try again later.');
        console.error('Failed to fetch products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') resetForm();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = useCallback(
    debounce((value) => {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }, 300),
    [products]
  );

  const handleChangeCategory = (e) => {
    if (!e.target.value) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.categoryId._id === e.target.value)
      );
    }
  };

  const handleOrderChange = (product) => {
    console.log('Opening modal for product:', product.name); // Debug log
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      stock: product.stock,
      price: product.price,
    });
    setOpenModal(true);
    console.log('openModal should be true now');
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 1;
    if (quantity > orderData.stock) {
      alert('Request is greater than stock available');
    } else {
      setOrderData((prev) => ({
        ...prev,
        quantity,
        total: quantity * prev.price,
      }));
    }
  };

  const resetForm = () => {
    setOpenModal(false);
    setOrderData({
      productId: '',
      quantity: 1,
      total: 0,
      stock: 0,
      price: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (orderData.quantity > orderData.stock) {
      alert('Requested quantity exceeds available stock.');
      return;
    }

    console.log('Submitting orderData:', orderData); // Debug log

    try {
      const response = await axios.post(
        'http://localhost:3000/api/orders/add',
        {
          productId: orderData.productId,
          quantity: orderData.quantity,
          total: orderData.quantity * orderData.price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );

      if (response.data.success) {
        alert('Order placed successfully');
        resetForm();
        fetchProducts();
      } else {
        alert('Failed to place order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <div className='py-4 px-6'>
        <h1 className='text-xl font-bold'>Products</h1>
      </div>

      <div className='flex justify-between items-center py-4 px-6'>
        <div>
          <select name="category" className='border p-1 bg-white rounded' onChange={handleChangeCategory}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type='text'
            placeholder='Search...'
            className='border p-1 bg-white px-4 rounded w-3/4'
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div>
        <table className='w-full border-collapse border border-gray-300 mt-4'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 p-2'>S No</th>
              <th className='border border-gray-300 p-2'>Product Name</th>
              <th className='border border-gray-300 p-2'>Category Name</th>
              <th className='border border-gray-300 p-2'>Price</th>
              <th className='border border-gray-300 p-2'>Stock</th>
              <th className='border border-gray-300 p-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className='text-center text-gray-500 p-4'>Loading...</td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td className='border p-2'>{index + 1}</td>
                  <td className='border p-2'>{product.name}</td>
                  <td className='border p-2'>{product.categoryId.categoryName}</td>
                  <td className='border p-2'>{product.price}</td>
                  <td className='border p-2'>
                    {product.stock === 0 ? (
                      <span className='bg-red-100 text-red-500 px-2 py-1 rounded-full'>
                        {product.stock}
                      </span>
                    ) : product.stock < 5 ? (
                      <span className='bg-yellow-100 text-yellow-500 px-2 py-1 rounded-full'>
                        {product.stock}
                      </span>
                    ) : (
                      <span className='bg-green-100 text-green-500 px-2 py-1 rounded-full'>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className='border p-2'>
                    <button
                      className='px-2 py-1 bg-green-400 text-white rounded hover:bg-green-700 disabled:opacity-50'
                      onClick={() => handleOrderChange(product)}
                      disabled={product.stock === 0}
                     
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className='text-center text-gray-500 p-4'>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {openModal && (
        
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50'>
          <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
            <h1 className='text-xl font-bold'>Place Order</h1>
            <button
              className='absolute top-4 right-4 font-bold text-lg cursor-pointer'
              onClick={resetForm}
            >
              X
            </button>
            <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
              <input
                type='number'
                name='quantity'
                value={orderData.quantity}
                onChange={handleQuantityChange}
                placeholder='Add Quantity'
                className='border p-1 bg-white px-4 rounded'
                required
              />
              <div>Total: ₦{orderData.quantity * orderData.price}</div>

              <div className='flex space-x-2'>
                <button
                  type='submit'
                  className='w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-700'
                >
                  Save Changes
                </button>
                <button
                  type='button'
                  className='w-full rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-700'
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
