import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Addresses from './pages/Addresses';
import Profile from './pages/Profile';
import { useAuthStore } from './store/authStore';

function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="produto/:slug" element={<ProductDetail />} />
          <Route path="carrinho" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="cadastro" element={<Login />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="meus-enderecos" element={<Addresses />} />
          
          {/* Admin routes */}
          <Route path="admin" element={<AdminDashboard />} />
          {/* Outras podem ser adicionadas */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
