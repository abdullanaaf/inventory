import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './utils/Root.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Categories from './components/Categories.jsx';
import Suppliers from './components/Suppliers.jsx';
import Product from './components/Product.jsx';
import Logout from './components/Logout.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes requireRole="admin">
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<h1>Summary of Dashboard</h1>} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Product />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="users" element={<h1>Users</h1>} />
          <Route path="profile" element={<h1>Profile</h1>} />
          <Route path="logout" element={<Logout />} />
        </Route>

        <Route path="/customer/dashboard" element={<h1>Customer Dashboard</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<p className='text-3xl font-bold mt-20 ml-20'>Unauthorized</p>} />

        {/* Optional 404 route */}
        <Route path="*" element={<p className='text-2xl text-red-600 font-bold p-10'>404 - Page Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
