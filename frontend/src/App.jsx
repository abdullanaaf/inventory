import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './utils/Root.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import react from 'react';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route 
        path="/admin-dashboard" 
        element={<ProtectedRoutes 
        requireRole="admin"
        >
          <Dashboard />
          </ProtectedRoutes>}
          >
            <Route index element={<h1 className='text-center font-bold text-xl'>Summary of Dashboard</h1>}/>
            <Route path="categories" element={<h1>Categories</h1>} />
            <Route path="products" element={<h1>Products</h1>} />
            <Route path="suppliers" element={<h1>Suppliers</h1>} />
            <Route path="orders" element={<h1>Orders</h1>} />
            <Route path="users" element={<h1>Users</h1>} />
            <Route path="profile" element={<h1>Profile</h1>} />
            <Route path="logout" element={<h1>Logout</h1>} />
        </Route>
        <Route path="/customer/dashboard" element={<h1>Customer Dashboard</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<p className='text-3xl font-bold mt-20 ml-20'>unauthorized</p>} />
      </Routes>
    </Router>
  );
}

export default App;
