import React, { createContext, useEffect, useState, ReactNode } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { app } from "../firebase/firebase.config"; // Make sure this import is correct
// or update it to your correct path

interface AuthContextType {
  user: User | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const auth = getAuth(app);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

   const signin = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () =>{
    setLoading(true);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("current user", currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const authInfo: AuthContextType = {
    user,
    loading,
    createUser,
    signin,
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
