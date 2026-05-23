import React from "react";
import { AuthContext } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  return (
    <AuthContext.Provider value={undefined}>
      {children}
    </AuthContext.Provider>
  );
};
