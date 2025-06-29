import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Product = () => {
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    supplierId: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        setSuppliers(response.data.suppliers);
        setCategories(response.data.categories);
        setProducts(response.data.products);
      } else {
        alert('Failed to fetch products. Please try again later.');
        console.error('Failed to fetch products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setOpenModal(true);
    setEditProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId._id,
      supplierId: product.supplierId._id,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      supplierId: '',
    });
    setOpenModal(false);
    setEditProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editProduct
      ? `http://localhost:3000/api/products/${editProduct}`
      : 'http://localhost:3000/api/products/add';

    const method = editProduct ? axios.put : axios.post;

    try {
      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        alert(`Product ${editProduct ? 'updated' : 'added'} successfully!`);
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error(`Error ${editProduct ? 'updating' : 'adding'} product:`, error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Product?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        alert('Product Deleted Successfully');
        fetchProducts();
      } else {
        alert('Error Deleting Product');
      }
    } catch (error) {
      alert('Server Error Deleting Product');
    }
  };

  return (
    <div className='w-full h-full flex flex-col p-4 gap-4'>
      <h1 className='text-2xl font-bold'>Product Management</h1>

      <div className='flex justify-between items-center'>
        <input
          type='text'
          placeholder='Search...'
          className='border p-1 bg-white px-4 rounded w-3/4'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className='px-4 py-1.5 bg-blue-400 text-white rounded cursor-pointer hover:bg-blue-500'
          onClick={() => setOpenModal(true)}
        >
          Add Product
        </button>
      </div>

      <div>
        <table className='w-full border-collapse border border-gray-300 mt-4'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 p-2'>S No</th>
              <th className='border border-gray-300 p-2'>Product Name</th>
              <th className='border border-gray-300 p-2'>Category Name</th>
              <th className='border border-gray-300 p-2'>Supplier Name</th>
              <th className='border border-gray-300 p-2'>Price</th>
              <th className='border border-gray-300 p-2'>Stock</th>
              <th className='border border-gray-300 p-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product, index) => (
                <tr key={product._id}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>{product.name}</td>
                  <td className='border border-gray-300 p-2'>{product.categoryId.categoryName}</td>
                  <td className='border border-gray-300 p-2'>{product.supplierId.name}</td>
                  <td className='border border-gray-300 p-2'>{product.price}</td>
                  <td className='border border-gray-300 p-2'>
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
                  <td className='border border-gray-300 p-2'>
                    <button
                      className='px-2 py-1 bg-yellow-400 text-white rounded mr-2 cursor-pointer hover:bg-yellow-500'
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className='px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500'
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
            <h1 className='text-xl font-bold'>{editProduct ? 'Edit Product' : 'Add Product'}</h1>
            <button
              className='absolute top-4 right-4 font-bold text-lg cursor-pointer'
              onClick={resetForm}
            >
              X
            </button>
            <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Product Name'
                className='border p-1 bg-white px-4 rounded'
                required
              />
              <input
                type='text'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Description'
                className='border p-1 bg-white px-4 rounded'
                required
              />
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                placeholder='Add price'
                className='border p-1 bg-white px-4 rounded'
                required
              />
              <input
                type='number'
                name='stock'
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder='Stock quantity'
                className='border p-1 bg-white px-4 rounded'
                required
              />
              <select
                name='categoryId'
                value={formData.categoryId}
                onChange={handleChange}
                className='border p-1 px-4 rounded w-full'
                required
              >
                <option value=''>Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <select
                name='supplierId'
                value={formData.supplierId}
                onChange={handleChange}
                className='border p-1 px-4 rounded w-full'
                required
              >
                <option value=''>Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <div className='flex space-x-2'>
                <button
                  type='submit'
                  className='w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-700'
                >
                  {editProduct ? 'Save Changes' : 'Add Product'}
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

export default Product;
