import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Send, Mail, CheckCircle } from 'lucide-react';

const Footer: React.FC = () => {
    const { i18n } = useTranslation();
    const currentYear = new Date().getFullYear();
    const isRtl = i18n.language === 'ar';

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    // Footer links with actual working routes
    const footerSections = [
        {
            title: 'NEWS',
            titleAr: 'الأخبار',
            links: [
                { name: 'Politics', nameAr: 'سياسة', path: '/category/politics' },
                { name: 'Economy', nameAr: 'اقتصاد', path: '/category/economy' },
                { name: 'Technology', nameAr: 'تكنولوجيا', path: '/category/technology' },
                { name: 'Sports', nameAr: 'رياضة', path: '/category/sports' },
            ]
        },
        {
            title: 'ACCOUNT',
            titleAr: 'الحساب',
            links: [
                { name: 'Sign In', nameAr: 'تسجيل الدخول', path: '/login' },
                { name: 'Sign Up', nameAr: 'إنشاء حساب', path: '/signup' },
                { name: 'Home', nameAr: 'الرئيسية', path: '/' },
            ]
        }
    ];

    const handleContact = (e: React.FormEvent) => {
        e.preventDefault();
        // Open email client with pre-filled message
        const mailtoLink = `mailto:contact@globalpulse.news?subject=Contact from Global Pulse&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
        window.open(mailtoLink, '_blank');
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setEmail('');
        setMessage('');
    };

    return (
        <footer className="footer bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-700 pt-12 pb-8 mt-auto">
            <div className="container px-4">

                {/* Contact Section */}
                <div className={`border-b border-slate-700 pb-12 mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="font-serif font-bold text-2xl mb-2 text-white flex items-center gap-2">
                                <Mail className="text-blue-400" size={24} />
                                {isRtl ? 'تواصل معنا' : 'Contact Us'}
                            </h3>
                            <p className="text-sm text-slate-400">
                                {isRtl ? 'أرسل لنا رسالتك وسنرد في أقرب وقت' : 'Send us a message and we\'ll respond shortly'}
                            </p>
                        </div>
                        <form onSubmit={handleContact} className="flex flex-col gap-3">
                            <input
                                type="email"
                                required
                                placeholder={isRtl ? 'بريدك الإلكتروني' : 'Your email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${isRtl ? 'text-right' : 'text-left'}`}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    placeholder={isRtl ? 'رسالتك' : 'Your message'}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className={`bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2"
                                >
                                    {sent ? <CheckCircle size={20} /> : <Send size={20} />}
                                    {sent ? (isRtl ? 'تم!' : 'Sent!') : (isRtl ? 'إرسال' : 'Send')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Links Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {/* Logo Section */}
                    <div className="col-span-2">
                        <Link to="/" className="font-serif font-black text-3xl mb-4 block text-white hover:text-blue-400 transition-colors">
                            Global Pulse
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-serif italic mb-4">
                            {isRtl ? 'مصدرك اليومي للأخبار العالمية من مصادر موثوقة' : 'Your daily source for global news from trusted sources'}
                        </p>
                        <div className="text-xs text-slate-500">
                            BBC • Reuters • Al Jazeera • ESPN • TechCrunch • The Guardian
                        </div>
                    </div>

                    {/* Dynamic Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-sans font-bold uppercase text-xs tracking-widest text-blue-400 mb-4">
                                {isRtl ? section.titleAr : section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                                        >
                                            {isRtl ? link.nameAr : link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Designer Credit - BIG & PROMINENT */}
                <div className="border-t border-slate-700 pt-8 mb-6">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <span className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                            {isRtl ? 'تم التصميم والتطوير بواسطة' : 'Designed & Developed by'}
                        </span>
                        <div
                            className="text-3xl md:text-4xl font-black uppercase tracking-wider py-3 px-8 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
                                letterSpacing: '0.1em'
                            }}
                        >
                            ✨ HASANAIN SALAH ✨
                        </div>
                        <div className="text-sm text-slate-400 mt-2">
                            Full-Stack Developer & UI/UX Designer
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className={`border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans uppercase tracking-widest text-slate-500 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <span>© {currentYear} GLOBAL PULSE MEDIA. ALL RIGHTS RESERVED. v2.0</span>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-white transition-colors">PRIVACY</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">TERMS</Link>
                        <Link to="/sitemap.xml" className="hover:text-white transition-colors">SITEMAP</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
