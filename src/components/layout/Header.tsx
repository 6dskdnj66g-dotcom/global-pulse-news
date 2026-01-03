import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from '../theme/ModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import SearchOverlay from '../common/SearchOverlay';
import { getWeatherByLocation } from '../../services/weatherService';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { key: 'politics', path: '/category/politics' },
        { key: 'economy', path: '/category/economy' },
        { key: 'technology', path: '/category/technology' },
        { key: 'sports', path: '/category/sports' },
        { key: 'health', path: '/category/health' },
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Weather State
    const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(null);

    useEffect(() => {
        // Fetch Weather based on user location
        getWeatherByLocation().then(data => {
            setWeather({ temp: data.temperature, icon: data.icon });
        });
    }, []);

    const dateString = new Date().toLocaleDateString(t('locale') === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <header className={`bg-background text-foreground border-b border-black/10 dark:border-white/10 transition-all duration-300 ${isScrolled ? 'sticky top-0 z-50 shadow-md' : ''}`}>

                {/* Top Tools Bar */}
                <div className="container py-1 flex justify-between items-center text-[11px] font-sans tracking-tight uppercase border-b border-border/50">
                    <div className="flex items-center gap-4">
                        <button className="hover:text-primary-accent transition-colors" onClick={() => setIsSearchOpen(true)}>
                            <Search size={14} />
                        </button>
                        <div className="hidden sm:block opacity-60">
                            {dateString}
                        </div>
                        {/* Weather Widget (New) */}
                        {weather && (
                            <div className="flex items-center gap-1 opacity-80 border-s border-border/50 ps-4">
                                <span>{weather.icon}</span>
                                <span>{weather.temp}°C</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <ModeToggle />
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="hidden md:inline font-bold text-primary-accent">Hello, {user.name}</span>
                                <button onClick={logout} className="hover:text-red-500 transition-colors font-bold">Log out</button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-1 font-bold hover:text-primary-accent transition-colors">
                                <User size={12} /> Log in
                            </Link>
                        )}
                    </div>
                </div>

                {/* Masthead (Logo) */}
                <div className="container py-6 relative flex justify-center items-center">
                    <button
                        className="md:hidden absolute left-4 p-2"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="text-center group">
                        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-normal pb-2 group-hover:opacity-90 transition-opacity">
                            {t('app.title')}
                        </h1>
                        <div className="mt-2 text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] opacity-60 border-t border-b border-black/10 dark:border-white/10 py-1 inline-block px-4">
                            {i18n.language === 'ar' ? 'تأسس 2025 • الإصدار اليومي' : 'Est. 2025 • Daily Edition'}
                        </div>
                    </Link>
                </div>

                {/* Navigation Bar (Desktop) */}
                <div className="border-t border-b border-black/10 dark:border-white/10 hidden md:block">
                    <nav className="container flex justify-center">
                        <div className="flex py-3 gap-8 font-sans text-xs font-bold uppercase tracking-widest">
                            <Link to="/" className={`hover:text-primary-accent transition-colors ${location.pathname === '/' ? 'text-primary-accent' : ''}`}>
                                {t('nav.home')}
                            </Link>
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    className={`hover:text-primary-accent transition-colors relative group ${location.pathname === item.path ? 'text-primary-accent' : ''}`}
                                >
                                    {t(`nav.${item.key}`)}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            </header>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] flex md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <div className="relative w-[300px] bg-background/95 backdrop-blur-xl h-full shadow-2xl p-6 flex flex-col border-r border-border overflow-y-auto">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                                {t('app.title')}
                            </span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links (FIRST PRIORITY) */}
                        <nav className="space-y-4 mb-8 flex-1">
                            <Link
                                to="/"
                                className={`block text-lg font-bold px-4 py-2 rounded-lg transition-all ${location.pathname === '/'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('nav.home')}
                            </Link>
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    className={`block text-lg font-bold px-4 py-2 rounded-lg transition-all ${location.pathname === item.path
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t(`nav.${item.key}`)}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Auth Status (BOTTOM) */}
                        <div className="mt-auto p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-white/5">
                            {user ? (
                                <div>
                                    <p className="font-bold mb-2 text-sm text-indigo-500">Welcome, {user.name}</p>
                                    <button onClick={logout} className="text-xs uppercase tracking-widest text-red-500 font-bold hover:text-red-400">
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center justify-center gap-2 font-bold bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20" onClick={() => setIsMenuOpen(false)}>
                                    <User size={18} /> Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
