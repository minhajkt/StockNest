import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppTheme from './themes/AppTheme';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Customers from './pages/Customers';
import Home from './pages/Home';
import Products from './pages/Products';
import Sales from './pages/Sales';

function App() {

  return (
    <>
      <AppTheme>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<Products />} />
              <Route path="sales" element={<Sales />} />
            </Route>
          </Routes>
        </Router>
      </AppTheme>
    </>
  );
}

export default App
