'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeFirebase, getIdToken } from '@/lib/firebase-client';
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
    user: null,
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { auth } = initializeFirebase();

    useEffect(() => {
        if (auth) {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                setUser(user);

                if (user) {
                    // Actualizar la cookie de sesión cuando el usuario esté autenticado
                    const token = await getIdToken();
                    if (token) {
                        try {
                            await fetch('/api/auth/session', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ token }),
                            });
                        } catch (error) {
                            console.error('Error updating session:', error);
                        }
                    }
                }

                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [auth]);

    const logout = async () => {
        try {
            await signOut(auth); // Cierra la sesión en Firebase
            setUser(null); // Limpia el estado del usuario
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}