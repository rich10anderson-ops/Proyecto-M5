import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import {
  getUserProfile,
  loginService,
  logoutService,
  signupService,
  loginWithGoogleService,
} from "../services/auth.services/auth.service";

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
      let userProfile = await getUserProfile(firebaseUser.uid);
      
      // Si el perfil no existe en Firestore (ej: primer login con Google), se crea automáticamente:
      if (!userProfile) {
        const isEmailAdmin = firebaseUser.email?.toLowerCase().includes("admin") ?? false;
        const role = isEmailAdmin ? "admin" : "customer";
        
        await setDoc(doc(db, "users", firebaseUser.uid), {
          email: firebaseUser.email || "",
          role: role,
          name: firebaseUser.displayName || "Street Explorer",
          createdAt: new Date().toISOString(),
        });
        
        userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          role: role,
        };
      }

      setProfile(userProfile);
      setUser(firebaseUser);
      setLoading(false);
    });

    //* Clean UP:
    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogleService();
    } catch (err: any) {
      console.error(err);
      const errorMsg = "Error al iniciar sesión con Google.";
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
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
