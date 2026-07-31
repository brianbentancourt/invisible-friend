'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Button,
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@nextui-org/react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { getNavLinks } from '@/lib/content';
import { track, EVENTS } from '@/lib/analytics';

const LANGUAGES = [
    { key: 'es', flag: '🇪🇸', label: 'ES', description: 'Español' },
    { key: 'en', flag: '🇺🇸', label: 'EN', description: 'English' },
    { key: 'pt', flag: '🇧🇷', label: 'PT', description: 'Português' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t, locale, changeLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = getNavLinks(locale);

    const handleLogout = async () => {
        try {
            await logout();
            router.push(`/${locale}`);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const navItems = [
        links.generator && { href: `/${locale}/${links.generator.slug}`, label: t('nav.how_it_works') },
        links.pricing && { href: `/${locale}/${links.pricing.slug}`, label: t('nav.pricing') },
        links.faq && { href: `/${locale}/${links.faq.slug}`, label: t('nav.faq') },
    ].filter(Boolean);

    const currentLang = LANGUAGES.find((l) => l.key === locale) || LANGUAGES[0];

    return (
        <NextUINavbar isBordered maxWidth="xl" onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
            <NavbarContent justify="start" className="gap-3">
                <NavbarMenuToggle className="sm:hidden" />
                <NavbarBrand>
                    <NextLink href={`/${locale}`} className="flex items-center gap-2">
                        <span className="text-2xl">🎁</span>
                        <span className="text-lg md:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {t('landing.title2')}
                        </span>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="center" className="hidden sm:flex gap-6">
                {navItems.map((item) => (
                    <NavbarItem key={item.href}>
                        <NextLink
                            href={item.href}
                            className="text-sm text-default-600 hover:text-primary transition-colors"
                        >
                            {item.label}
                        </NextLink>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end" className="gap-2">
                <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button
                                variant="flat"
                                size="sm"
                                radius="full"
                                aria-label="Idioma"
                                className="font-semibold bg-default-100 hover:bg-default-200 min-w-0 px-3"
                            >
                                <span className="text-base">{currentLang.flag}</span>
                                <span className="hidden sm:inline">{currentLang.label}</span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Cambiar idioma"
                            onAction={(key) => changeLanguage(key)}
                            selectedKeys={new Set([locale])}
                            selectionMode="single"
                            color="primary"
                            variant="flat"
                            className="w-[160px]"
                        >
                            {LANGUAGES.map((language) => (
                                <DropdownItem
                                    key={language.key}
                                    startContent={<span className="text-xl">{language.flag}</span>}
                                    description={language.description}
                                >
                                    {language.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>

                {user ? (
                    <>
                        <NavbarItem className="hidden md:flex">
                            <Button
                                as={NextLink}
                                href={`/${locale}/dashboard`}
                                color="primary"
                                variant="flat"
                                size="sm"
                            >
                                {t('nav.dashboard')}
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="danger" variant="light" size="sm" onPress={handleLogout}>
                                {t('nav.logout')}
                            </Button>
                        </NavbarItem>
                    </>
                ) : (
                    <>
                        <NavbarItem className="hidden md:flex">
                            <Button
                                as={NextLink}
                                href={`/${locale}/auth/signin`}
                                variant="light"
                                size="sm"
                            >
                                {t('nav.login')}
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={NextLink}
                                href={`/${locale}/dashboard`}
                                color="primary"
                                variant="shadow"
                                size="sm"
                                className="font-semibold"
                                onPress={() => track(EVENTS.CTA_CLICK, { source: 'navbar' })}
                            >
                                {t('nav.cta')}
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            <NavbarMenu>
                {navItems.map((item) => (
                    <NavbarMenuItem key={item.href}>
                        <NextLink
                            href={item.href}
                            className="w-full py-2 block"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </NextLink>
                    </NavbarMenuItem>
                ))}
                <NavbarMenuItem>
                    <NextLink
                        href={`/${locale}/dashboard`}
                        className="w-full py-2 block text-primary font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('nav.cta')}
                    </NextLink>
                </NavbarMenuItem>
                {!user && (
                    <NavbarMenuItem>
                        <NextLink
                            href={`/${locale}/auth/signin`}
                            className="w-full py-2 block"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('nav.login')}
                        </NextLink>
                    </NavbarMenuItem>
                )}
            </NavbarMenu>
        </NextUINavbar>
    );
}
