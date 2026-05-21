import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </>
  );
};
