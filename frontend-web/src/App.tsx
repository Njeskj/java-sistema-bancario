import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Payments from './pages/Payments';
import Investments from './pages/Investments';
import Cards from './pages/Cards';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há token no localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Rota pública inicial */}
        <Route path="/" element={<Home />} />
        
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas privadas */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
