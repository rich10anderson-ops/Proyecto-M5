import { Navigate, Route, Routes } from "react-router-dom";
import { AdminOrdersPlaceholder } from "../components/admin/AdminOrdersPlaceholder";
import { AdminProductsPage } from "../components/admin/AdminProductsPage";
import { ProductFormPage } from "../components/admin/ProductFormPage";
import { Layout } from "../components/Layout";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { SignupPage } from "../pages/SignupPage";
import { AdminRoute } from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Publicas: */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protegidas: */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Admin: */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="orders" element={<AdminOrdersPlaceholder />} />
        </Route>
      </Route>
    </Routes>
  );
};
