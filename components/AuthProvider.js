'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeFirebase } from '@/lib/firebase-client';

const AuthContext = createContext({
    user: null,
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { auth } = initializeFirebase();
        if (auth) {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                setUser(user);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}