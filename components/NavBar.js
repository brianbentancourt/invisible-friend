'use client';

import { useAuth } from '@/components/AuthProvider';
import { Button, Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/signin'); // Redirige al usuario a la página de login
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    if (!user) return null;

    return (
        <NextUINavbar isBordered>
            <NavbarBrand>
                <h1 className="text-lg font-bold">Amigo invisible</h1>
            </NavbarBrand>
            <NavbarContent>
                {user ? (
                    <>
                        <NavbarItem>
                            <span>Hola, {user.displayName || user.email}</span>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="error" onClick={handleLogout}>
                                Cerrar Sesión
                            </Button>
                        </NavbarItem>
                    </>
                ) : (
                    <NavbarItem>
                        <Button color="primary" onClick={() => router.push('/login')}>
                            Iniciar Sesión
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>
        </NextUINavbar>
    );
}