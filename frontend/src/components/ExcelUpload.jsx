import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );

      if (response.data.success) {
        alert('File uploaded successfully');
        setFile(null);
      } else {
        alert('File upload failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Check the console for more info.');
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Excel File
        </label>
        <a
          href="/invoicelist.xlsx"
          download
          className="text-sm text-blue-600 hover:underline"
        >
          Download Template
        </a>
      </div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Upload Excel
      </button>
    </form>
  );
};

export default ExcelUpload;
