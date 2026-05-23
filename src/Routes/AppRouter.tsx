import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Dashboard } from "../pages/admin/Dashboard";
import { Cart } from "../pages/cart/Cart";
import { Checkout } from "../pages/chekout/Checkout";
import { Home } from "../pages/home/Home";
import Login from "../pages/login/Login";
import { ProductDetail } from "../pages/products/ProductDetail";
import Register from "../pages/Register";
import { AdminRoute, ProtectedRoute } from "./protected/ProtectedRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas: */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas: */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* Admin: */}
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Route>
    </Routes>
  );
};
