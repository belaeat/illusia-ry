import React, { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextProps {
    user: User | null;
    role: 'admin' | 'superadmin' | 'user' | null;
    setRole: React.Dispatch<React.SetStateAction<'admin' | 'superadmin' | 'user' | null>>;
    createUser: (email: string, password: string) => Promise<any>;
    loginUser: (email: string, password: string) => Promise<any>;
    logOut: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    role: null,
    setRole: () => { },
    createUser: () => Promise.reject('Context not initialized'),
    loginUser: () => Promise.reject('Context not initialized'),
    logOut: () => Promise.reject('Context not initialized'),
    loading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'admin' | 'superadmin' | 'user' | null>(null);
    const [loading, setLoading] = useState(true);

    //register user 
    const createUser = (email: string, password: string) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //login user
    const loginUser = (email: string, password: string) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // to sign out from website
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // to check if user is logged in or not
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                // For demo purposes, I have set my email as superadmin.
                // In a real application, we would fetch the role from the database.
                if (user.email === "belaeat007@gmail.com") {
                    setRole('superadmin');
                } else {
                    setRole('user');
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        role,
        setRole,
        createUser,
        loginUser,
        logOut,
        loading
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};