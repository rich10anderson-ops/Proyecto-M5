import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>

      {/* Link solo para Usuario Logueado: */}
      {user ? (
        <>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </>
      ) : null}

      {/* Link solo para Administrador: */}
      {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {/* Ver Logout ó Login/Signup: */}
        {user ? (
          <>
            <span>{user.email}</span>
            <button
              onClick={() => (window.confirm("Logout?") ? logout() : null)}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </header>
  );
};
