import React, { createContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { app } from "../firebase/firebase.config"; // Make sure this import is correct
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart, restoreCart } from "../store/slices/cartSlice";
// or update it to your correct path

interface AuthContextType {
  user: (User & { role?: "super-admin" | "admin" | "user" }) | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserRole: (role: "super-admin" | "admin" | "user") => void;
  isUserMode: boolean;
  toggleUserMode: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const auth = getAuth(app);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<
    (User & { role?: "super-admin" | "admin" | "user" }) | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserMode, setIsUserMode] = useState<boolean>(false);
  const [originalRole, setOriginalRole] = useState<
    "super-admin" | "admin" | "user" | null
  >(null);
  const dispatch = useDispatch();

  const createUser = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signin = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setLoading(true);
    // Clear the token from localStorage
    localStorage.removeItem("token");
    return signOut(auth);
  };

  const updateUserRole = (role: "super-admin" | "admin" | "user") => {
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, role };
      }
      return prevUser;
    });
  };

  // Toggle between admin and user mode
  const toggleUserMode = () => {
    if (!user) return;

    if (isUserMode) {
      // Switching back to admin mode - restore original role
      if (originalRole) {
        updateUserRole(originalRole);
      }
    } else {
      // Switching to user mode - save current role and set to user
      setOriginalRole(user.role || null);
      updateUserRole("user");
    }

    setIsUserMode(!isUserMode);
  };

  // Function to fetch user role from backend
  const fetchUserRole = async (email: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/auth/user-role/${email}`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        // Check if token is included in the response
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log(
            "Token received from user-role endpoint and stored in localStorage"
          );
        }

        if (response.data.role) {
          updateUserRole(response.data.role);
          setOriginalRole(response.data.role);
          return response.data.role;
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
    return "user"; // Default role if fetch fails
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        // Get the current role from the user state before updating
        const currentRole = user?.role;

        // If we have a current role, preserve it
        if (currentRole) {
          setUser({ ...currentUser, role: currentRole });
        } else {
          // If no role is set yet, try to fetch from backend
          const role = await fetchUserRole(currentUser.email || "");
          setUser({ ...currentUser, role });
        }

        // Check if token exists in localStorage, if not try to get it from backend
        const token = localStorage.getItem("token");
        if (!token && currentUser.email) {
          try {
            console.log(
              "No token found in localStorage, attempting to get it from backend"
            );
            const response = await fetch(
              "http://localhost:5001/api/auth/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  email: currentUser.email,
                  // We can't get the password here, so this might not work
                  // This is just a fallback attempt
                }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.token) {
                localStorage.setItem("token", data.token);
                console.log(
                  "Token retrieved from backend and stored in localStorage"
                );
              }
            }
          } catch (error) {
            console.error("Error retrieving token from backend:", error);
          }
        }

        // Restore cart when user logs in
        if (currentUser.email) {
          dispatch(restoreCart(currentUser.email));
        }
      } else {
        setUser(null);
        setOriginalRole(null);
        setIsUserMode(false);
        // Clear cart when user logs out
        if (user?.email) {
          dispatch(clearCart({ saveToStorage: true, userEmail: user.email }));
        }
      }
      console.log("current user", currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, user?.role, user?.email]);

  const authInfo: AuthContextType = {
    user,
    loading,
    createUser,
    signin,
    logout,
    updateUserRole,
    isUserMode,
    toggleUserMode,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
