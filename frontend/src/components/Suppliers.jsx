import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {
  const [addModal, setAddModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/supplier', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        setSuppliers(response.data.suppliers);
        setFilteredSuppliers(response.data.suppliers); // ✅ fix here
      } else {
        console.error('Error fetching suppliers:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      mobile: supplier.mobile,
      address: supplier.address
    });
    setEditSupplier(supplier._id);
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      address: ''
    });
    setEditSupplier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editSupplier
        ? `http://localhost:3000/api/supplier/${editSupplier}`
        : 'http://localhost:3000/api/supplier/add';

      const method = editSupplier ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });

      if (response.data.success) {
        alert(editSupplier ? 'Supplier Edited Successfully' : 'Supplier Added Successfully');
        closeModal();
        fetchSuppliers();
      } else {
        alert('Error submitting supplier');
      }
    } catch (error) {
      console.error('Error submitting supplier:', error);
      alert('Server error, please try again later.');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.mobile.toString().includes(query) ||
      supplier.address.toLowerCase().includes(query)
    );
    setFilteredSuppliers(filtered);
  };

  return (
    <div className='w-full h-full flex flex-col p-4 gap-4'>
      <h1 className='text-2xl font-bold'>Supplier Management</h1>

      <div className='flex justify-between items-center'>
        <input
          type='text'
          placeholder='Search...'
          className='border p-1 bg-white px-4 rounded'
          onChange={handleSearch}
        />
        <button
          className='px-4 py-1.5 bg-blue-400 text-white rounded cursor-pointer hover:bg-blue-500'
          onClick={() => setAddModal(true)}
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <div>Loading.....</div>
      ) : filteredSuppliers.length > 0 ? (
        <table className='w-full border-collapse border border-gray-300 mt-4'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 p-2'>S No</th>
              <th className='border border-gray-300 p-2'>Name</th>
              <th className='border border-gray-300 p-2'>Email</th>
              <th className='border border-gray-300 p-2'>Mobile</th>
              <th className='border border-gray-300 p-2'>Address</th>
              <th className='border border-gray-300 p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier, index) => (
              <tr key={supplier._id}>
                <td className='border border-gray-300 p-2'>{index + 1}</td>
                <td className='border border-gray-300 p-2'>{supplier.name}</td>
                <td className='border border-gray-300 p-2'>{supplier.email}</td>
                <td className='border border-gray-300 p-2'>{supplier.mobile}</td>
                <td className='border border-gray-300 p-2'>{supplier.address}</td>
                <td className='border border-gray-300 p-2'>
                  <button
                    className='px-2 py-1 bg-yellow-400 text-white rounded mr-2 cursor-pointer hover:bg-yellow-500'
                    onClick={() => handleEdit(supplier)}
                  >
                    Edit
                  </button>
                  <button
                    className='px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500'
                    onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this supplier?')) {
                        return;
                      }
                      try {
                        const response = await axios.delete(
                          `http://localhost:3000/api/supplier/${supplier._id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
                            },
                          }
                        );
                        if (response.data.success) {
                          alert('Supplier Deleted Successfully');
                          fetchSuppliers();
                        } else {
                          alert('Error Deleting Supplier');
                        }
                      } catch (error) {
                        alert('Server Error Deleting Supplier');
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='text-center mt-4'>No suppliers found</div>
      )}

      {addModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
            <h1 className='text-xl font-bold'>
              {editSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </h1>
            <button
              className='absolute top-4 right-4 font-bold text-lg cursor-pointer'
              onClick={closeModal}
            >
              X
            </button>
            <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Supplier Name'
                className='border p-1 bg-white px-4 rounded'
                required
              />

              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Supplier Email'
                className='border p-1 bg-white px-4 rounded'
                required
              />

              <input
                type='number'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                placeholder='Supplier Mobile'
                className='border p-1 bg-white px-4 rounded'
                required
              />

              <input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='Supplier Address'
                className='border p-1 bg-white px-4 rounded'
                required
              />

              <div className='flex space-x-2'>
                <button
                  type='submit'
                  className='w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-700'
                >
                  {editSupplier ? 'Save Changes' : 'Add Supplier'}
                </button>
                {editSupplier && (
                  <button
                    type='button'
                    className='w-full rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-700'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
