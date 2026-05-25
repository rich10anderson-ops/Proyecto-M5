import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isMock: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchToMockMode: (role: UserRole) => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);

  const clearError = () => setError(null);

  const syncUserProfile = async (firebaseUser: User) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        setProfile(data);
      } else {
        // Crear un nuevo perfil de usuario en Firestore
        // Lista de correos autorizados como administradores
        const ALLOWED_ADMIN_EMAILS = ['rich10anderson@gmail.com'];
        const userEmail = firebaseUser.email?.toLowerCase();
        const isEmailAdmin = userEmail ? ALLOWED_ADMIN_EMAILS.includes(userEmail) : false;
        const newRole: UserRole = isEmailAdmin ? 'admin' : 'customer';

        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Street Explorer',
          role: newRole,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err: any) {
      console.warn('Firestore user profile sync failed (using local fallback profile):', err);
      const ALLOWED_ADMIN_EMAILS = ['rich10anderson@gmail.com'];
      const userEmail = firebaseUser.email?.toLowerCase();
      const isEmailAdmin = userEmail ? ALLOWED_ADMIN_EMAILS.includes(userEmail) : false;
      const fallbackProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Street Explorer (Local)',
        role: isEmailAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
    }
  };

  useEffect(() => {
    if (isMock) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncUserProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMock]);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setIsMock(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      let errorMsg = 'Error al iniciar sesión. Inténtalo de nuevo.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Correo o contraseña incorrectos.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMsg = 'Credenciales inválidas. Verifica tus datos.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Formato de correo electrónico no válido.';
      }
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    setIsMock(false);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

     
      await updateProfile(userCredential.user, { displayName: name });
      await syncUserProfile(userCredential.user);
    } catch (err: any) {
      console.error(err);
      let errorMsg = 'Error al registrarse. Inténtalo de nuevo.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'El correo electrónico ya está registrado.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      }
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    setIsMock(false);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      const errorMsg = 'Error al iniciar sesión con Google.';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    if (isMock) {
      setUser(null);
      setProfile(null);
      setIsMock(false);
      setLoading(false);
    } else {
      try {
        await signOut(auth);
      } catch (err: any) {
        console.error(err);
        setError('Error al cerrar sesión.');
        setLoading(false);
      }
    }
  };

  const switchToMockMode = (role: UserRole) => {
    setLoading(true);
    setIsMock(true);
    setError(null);

    const mockFirebaseUser = {
      uid: role === 'admin' ? 'mock-admin-123' : 'mock-customer-123',
      email: role === 'admin' ? 'rich10anderson@gmail.com' : 'streetwear@neontech.com',
      displayName: role === 'admin' ? 'CYBER ADMIN' : 'NEON BUYER',
    } as User;

    const mockProfile: UserProfile = {
      uid: mockFirebaseUser.uid,
      email: mockFirebaseUser.email!,
      name: mockFirebaseUser.displayName!,
      role: role,
      createdAt: new Date().toISOString(),
    };

    setUser(mockFirebaseUser);
    setProfile(mockProfile);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        isMock,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        switchToMockMode,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
