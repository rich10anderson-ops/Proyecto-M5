import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/layout/Navbar';
import CartDrawer from './components/cart/CartDrawer';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Home from './pages/home/Home';
import ProductDetail from './pages/products/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Profile from './pages/Profile';
import Login from './pages/login/Login';
import Register from './pages/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductsCrud from './pages/admin/ProductsCrud';
import OrdersList from './pages/admin/OrdersList';

// Main Layout Wrapper
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-light flex flex-col font-cyber relative">
      {/* CRT Scanline Overlay globally */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50" />
      
      {/* Grid pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,16,16,0.1)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        <Outlet />
      </main>

      <CartDrawer />

      {/* Cyberpunk Footer bar */}
      <footer className="border-t border-cyber-gray bg-cyber-black/75 py-4 z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[9px] text-cyber-light/30 uppercase tracking-widest">
          <div>
            NODO CENTRAL_ // ESTABLECIDO
          </div>
          <div>
            &copy; 2026 NEON TECH // TODOS LOS DERECHOS DIGITALES RESERVADOS.
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
                {/* Main Layout containing Public & Client-Protected routes */}
                <Route path="/" element={<MainLayout />}>
                  {/* Public Store Routes */}
                  <Route index element={<Navigate to="/products" replace />} />
                  <Route path="products" element={<Home />} />
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  
                  {/* Auth Routes */}
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />

                  {/* Protected Customer Routes */}
                  <Route
                    path="cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="admin"
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/products"
                    element={
                      <AdminRoute>
                        <ProductsCrud />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="admin/orders"
                    element={
                      <AdminRoute>
                        <OrdersList />
                      </AdminRoute>
                    }
                  />
                </Route>
              </Routes>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
