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
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button 
                                variant="flat" 
                                size="sm" 
                                radius="full"
                                className="font-semibold bg-default-100 hover:bg-default-200"
                                startContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                }
                            >
                                {locale === 'en' ? 'EN' : 'ES'}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Cambiar idioma" 
                            onAction={(key) => changeLanguage(key)}
                            selectedKeys={new Set([locale])}
                            selectionMode="single"
                            color="primary"
                            variant="flat"
                            className="w-[150px]"
                        >
                            <DropdownItem key="es" startContent={<span className="text-xl">🇪🇸</span>} description="Español">
                                ES
                            </DropdownItem>
                            <DropdownItem key="en" startContent={<span className="text-xl">🇺🇸</span>} description="English">
                                EN
                            </DropdownItem>
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