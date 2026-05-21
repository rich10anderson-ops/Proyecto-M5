import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Dashboard } from "../pages/admin/Dashboard";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { Home } from "../pages/Home";
import Login from "../pages/Login";
import { ProductDetail } from "../pages/ProductDetail";
import Register from "../pages/Register";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas: */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Protegidas: */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin: */}
        <Route path="/admin" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
