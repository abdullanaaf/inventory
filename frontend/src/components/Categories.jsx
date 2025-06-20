import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/category', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error('Error fetching categories:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCategory) {
      try {
      const response = await axios.put(
        `http://localhost:3000/api/category/${editCategory}`,
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );
      if (response.data.success) {
        setEditCategory(null)
        setCategoryName("");
        setCategoryDescription("");
        fetchCategories();
        alert('Category Updated Successfully');
        fetchCategories(); // Refresh the list
      } else {
        alert('Error Updading Category, Please Contact Administrator');
      }
    } catch (error) {
      alert('Error Updating Category, Please Contact Administrator');
    }
    } else {

    try {
      const response = await axios.post(
        'http://localhost:3000/api/category/add',
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );

      if (response.data.success) {
        setCategoryName("");
        setCategoryDescription("");
        alert('Category Added Successfully');
        fetchCategories(); // Refresh the list
      } else {
        alert('Error Adding Category, Please Contact Administrator');
      }
    } catch (error) {
      alert('Error Adding Category, Please Contact Administrator');
    }
  };
  }

  const handleDelete = async (id) => {
    
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/category/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        });
        if (response.data.success) {
          alert('Category Deleted Successfully');
          fetchCategories(); // Refresh the list
        } else {
          alert('Error Deleting Category, Please Contact Administrator');
        }
      } catch (error) {
        alert('Error Deleting Category, Please Contact Administrator');
      }
    }
  };

  const handleEdit = async (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancel = async () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };
  
  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>Category Management</h1>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='lg:w-1/3'>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <h2 className='text-center text-xl font-bold mb-4'>{editCategory ? "Edit Category" : "Add Category"}</h2>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder='Category Name'
                  className='border w-full p-2 rounded-md'
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder='Category Description'
                  className='border w-full p-2 rounded-md'
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  required
                />
              </div>
              <div className='flex space-x-2'>
              <button
                type="submit"
                className='w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-700'
              >
                {editCategory ? "Save Changes" : "Add Category"}
              </button>
              {
                editCategory && (
                  <button
                  type='button'
                  className='w-full rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-green-600'
                  onClick={handleCancel}
                  >
                  Cancel
                  </button>
                )
              }
              </div>
            </form>
          </div>
        </div>
        <div className='lg:w-2/3'>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-200 p-2'>S No.</th>
                  <th className='border border-gray-200 p-2'>Category Name</th>
                  <th className='border border-gray-200 p-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td className='border p-2'>{index + 1}</td>
                    <td className='border p-2'>{category.categoryName}</td>
                    <td className='border p-2'>
                      <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2' 
                      onClick={() => handleEdit(category)}>Edit</button>
                      <button className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700'
                      onClick={() => handleDelete(category._id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;