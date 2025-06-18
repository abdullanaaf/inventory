import React from 'react'
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router';

const Dashboard = () => {
  return (
    <div>
      <div className='flex'>
        <Sidebar />
      </div>
      <div className='flex-1 ml-16 md:ml-64 min-h-screen bg-gray-100'>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard;