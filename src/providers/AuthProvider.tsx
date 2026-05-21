import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { AuthContext } from "../contexts/AuthContext";
import { getUserProfile, loginService, logoutService, signupService } from "../services/auth.services/auth.service";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  //* 1. ESTADOS:
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      //* 1. NO hay sesión
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      //* 2. HAY sesión:
      const userProfile = await getUserProfile(firebaseUser.uid);
      setProfile(userProfile);
      setUser(firebaseUser);
      setLoading(false);
    });

    //* Clean UP:
    return unsubscribe;
  }, []);

  const clearError = () => setError(null);
  const loginWithGoogle = async () => {
    throw new Error("loginWithGoogle no está implementado en este proveedor");
  };
  const switchToMockMode = () => {
    setIsMock(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        isMock,
        loginWithEmail: loginService,
        registerWithEmail: signupService,
        loginWithGoogle,
        logout: logoutService,
        switchToMockMode,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
