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
        <NextUINavbar
            isBordered
            maxWidth="xl"
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            classNames={{
                base: "w-full overflow-hidden",
                wrapper: "w-full max-w-7xl px-3 sm:px-6 gap-2 sm:gap-4",
            }}
        >
            <NavbarContent justify="start" className="gap-2 sm:gap-3 shrink min-w-0">
                <NavbarMenuToggle
                    className="sm:hidden"
                    aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                />
                <NavbarBrand className="shrink min-w-0">
                    <NextLink href={`/${locale}`} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="text-xl sm:text-2xl shrink-0">🎁</span>
                        <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                            {t('landing.title2')}
                        </span>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="center" className="hidden sm:flex gap-4 md:gap-6">
                {navItems.map((item) => (
                    <NavbarItem key={item.href}>
                        <NextLink
                            href={item.href}
                            className="text-sm text-default-600 hover:text-primary transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </NextLink>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end" className="gap-1.5 sm:gap-2 shrink-0">
                <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button
                                variant="flat"
                                size="sm"
                                radius="full"
                                aria-label="Idioma"
                                className="font-semibold bg-default-100 hover:bg-default-200 min-w-0 px-2 sm:px-3 h-8 sm:h-9"
                            >
                                <span className="text-base">{currentLang.flag}</span>
                                <span className="hidden sm:inline text-xs sm:text-sm">{currentLang.label}</span>
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
                        {/* En desktop: Mi sorteo */}
                        <NavbarItem className="hidden sm:flex">
                            <Button
                                as={NextLink}
                                href={`/${locale}/dashboard`}
                                color="primary"
                                variant="flat"
                                size="sm"
                                className="font-medium"
                            >
                                {t('nav.dashboard')}
                            </Button>
                        </NavbarItem>
                        {/* En mobile: Botón Mi sorteo compacto */}
                        <NavbarItem className="sm:hidden">
                            <Button
                                as={NextLink}
                                href={`/${locale}/dashboard`}
                                color="primary"
                                variant="flat"
                                size="sm"
                                className="text-xs px-2.5 h-8 font-medium"
                            >
                                {t('nav.dashboard')}
                            </Button>
                        </NavbarItem>
                        {/* En desktop: Botón cerrar sesión con texto */}
                        <NavbarItem className="hidden sm:flex">
                            <Button color="danger" variant="light" size="sm" onPress={handleLogout}>
                                {t('nav.logout')}
                            </Button>
                        </NavbarItem>
                        {/* En mobile: Botón icono cerrar sesión rápido sin desbordar */}
                        <NavbarItem className="sm:hidden">
                            <Button
                                isIconOnly
                                color="danger"
                                variant="light"
                                size="sm"
                                aria-label={t('nav.logout')}
                                title={t('nav.logout')}
                                onPress={handleLogout}
                                className="w-8 h-8 min-w-8"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </Button>
                        </NavbarItem>
                    </>
                ) : (
                    <>
                        <NavbarItem className="hidden sm:flex">
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
                                className="font-semibold text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9"
                                onPress={() => track(EVENTS.CTA_CLICK, { source: 'navbar' })}
                            >
                                <span className="hidden sm:inline">{t('nav.cta')}</span>
                                <span className="sm:hidden">
                                    {locale === 'en' ? 'Start' : locale === 'pt' ? 'Começar' : 'Empezar'}
                                </span>
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            <NavbarMenu className="pt-4 pb-8 px-4 bg-background/95 backdrop-blur-md">
                {user && (
                    <div className="pb-3 mb-2 border-b border-default-100 flex items-center justify-between">
                        <span className="text-xs text-default-400 truncate max-w-[200px]">
                            👤 {user.email || 'Conectado'}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Online
                        </span>
                    </div>
                )}

                {navItems.map((item) => (
                    <NavbarMenuItem key={item.href}>
                        <NextLink
                            href={item.href}
                            className="w-full py-2.5 block text-base text-default-600 hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </NextLink>
                    </NavbarMenuItem>
                ))}

                <div className="pt-3 mt-2 border-t border-default-100 flex flex-col gap-2.5">
                    <NavbarMenuItem>
                        <Button
                            as={NextLink}
                            href={`/${locale}/dashboard`}
                            color="primary"
                            variant="shadow"
                            className="w-full font-semibold justify-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {user ? t('nav.dashboard') : t('nav.cta')}
                        </Button>
                    </NavbarMenuItem>

                    {user ? (
                        <NavbarMenuItem>
                            <Button
                                color="danger"
                                variant="flat"
                                className="w-full font-semibold justify-center"
                                onPress={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                            >
                                🚪 {t('nav.logout')}
                            </Button>
                        </NavbarMenuItem>
                    ) : (
                        <NavbarMenuItem>
                            <Button
                                as={NextLink}
                                href={`/${locale}/auth/signin`}
                                variant="bordered"
                                className="w-full font-semibold justify-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                🔑 {t('nav.login')}
                            </Button>
                        </NavbarMenuItem>
                    )}
                </div>
            </NavbarMenu>
        </NextUINavbar>
    );
}
