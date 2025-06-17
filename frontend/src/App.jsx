import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './utils/Root.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import react from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin/dashboard" element={<ProtectedRoutes requireRole="admin">
          <h1>Admin Dashboard</h1>
          </ProtectedRoutes>} />
        <Route path="/customer/dashboard" element={<h1>Customer Dashboard</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<p className='text-3xl font-bold mt-20 ml-20'>unauthorized</p>} />
      </Routes>
    </Router>
  );
}

export default App;
