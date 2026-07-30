'use client';

import { useAuth } from '@/components/AuthProvider';
import { Button, Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t, locale, changeLanguage } = useLanguage();

    const handleLogout = async () => {
        try {
            await logout();
            router.push(`/${locale}/auth/signin`); // Redirige al usuario a la página de login
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <NextUINavbar isBordered>
            <NavbarBrand>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🎁</span>
                    <h1 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        GiftLoop
                    </h1>
                </div>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="light" size="sm" className="text-lg">
                                {locale === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Cambiar idioma" onAction={(key) => changeLanguage(key)}>
                            <DropdownItem key="es">🇪🇸 Español</DropdownItem>
                            <DropdownItem key="en">🇺🇸 English</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
                {user ? (
                    <>
                        <NavbarItem className="hidden sm:flex">
                            <span className="text-sm">Hola, {user.displayName || user.email}</span>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="danger" variant="flat" size="sm" onClick={handleLogout}>
                                {t('nav.logout')}
                            </Button>
                        </NavbarItem>
                    </>
                ) : (
                    <NavbarItem>
                        <Button color="primary" variant="flat" size="sm" onClick={() => router.push(`/${locale}/auth/signin`)}>
                            {t('nav.login')}
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>
        </NextUINavbar>
    );
}