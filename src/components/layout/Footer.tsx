import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentYear = new Date().getFullYear();
    const isRtl = i18n.language === 'ar';

    // Footer links with actual working routes
    const footerSections = [
        {
            title: 'news',
            titleAr: 'الأخبار',
            links: [
                { name: 'politics', nameAr: 'سياسة', path: '/category/politics' },
                { name: 'economy', nameAr: 'اقتصاد', path: '/category/economy' },
                { name: 'technology', nameAr: 'تكنولوجيا', path: '/category/technology' },
                { name: 'sports', nameAr: 'رياضة', path: '/category/sports' },
            ]
        },
        {
            title: 'categories',
            titleAr: 'الأقسام',
            links: [
                { name: 'Breaking', nameAr: 'عاجل', path: '/' },
                { name: 'World', nameAr: 'عالمي', path: '/category/politics' },
                { name: 'Business', nameAr: 'أعمال', path: '/category/economy' },
                { name: 'Tech', nameAr: 'تقنية', path: '/category/technology' },
            ]
        },
        {
            title: 'account',
            titleAr: 'الحساب',
            links: [
                { name: 'Sign In', nameAr: 'تسجيل الدخول', path: '/login' },
                { name: 'Sign Up', nameAr: 'إنشاء حساب', path: '/signup' },
                { name: 'Bookmarks', nameAr: 'المحفوظات', path: '/' },
            ]
        },
        {
            title: 'about',
            titleAr: 'حول',
            links: [
                { name: 'About Us', nameAr: 'من نحن', path: '/' },
                { name: 'Contact', nameAr: 'تواصل', path: '/' },
                { name: 'Advertise', nameAr: 'إعلانات', path: '/' },
            ]
        }
    ];

    return (
        <footer className="footer bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-700 pt-12 pb-6 mt-auto">
            <div className="container px-4">
                {/* Newsletter Signup */}
                <div className={`border-b border-slate-700 pb-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 ${isRtl ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'}`}>
                    <div className="text-center md:text-left">
                        <h3 className="font-serif font-bold text-2xl mb-2 text-white">{t('footer.newsletter_title')}</h3>
                        <p className="text-sm text-slate-400">{t('footer.newsletter_desc')}</p>
                    </div>
                    <div className={`flex w-full md:w-auto gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <input
                            type="email"
                            placeholder={t('footer.newsletter_placeholder')}
                            className={`bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 w-full md:w-64 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded-lg whitespace-nowrap hover:scale-105">
                            {t('footer.subscribe')}
                        </button>
                    </div>
                </div>

                {/* Footer Links Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {/* Logo Section */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="font-serif font-black text-3xl mb-4 block text-white hover:text-primary transition-colors">
                            {t('app.title')}
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-serif italic">
                            {t('footer.motto')}
                        </p>
                    </div>

                    {/* Dynamic Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-sans font-bold uppercase text-xs tracking-widest text-primary mb-4">
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

                {/* Bottom Bar */}
                <div className={`border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans uppercase tracking-widest text-slate-400 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <span>© {currentYear} GLOBAL PULSE MEDIA. ALL RIGHTS RESERVED.</span>

                    {/* Designer Credit - 3D Effect */}
                    <div className="flex items-center gap-2">
                        <span
                            className="text-sm font-black uppercase tracking-widest py-1 px-3 rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F5D77A 50%, #B8860B 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 20px rgba(212,175,55,0.5)',
                            }}
                        >
                            ✨ DESIGNED BY HASANAIN SALAH ✨
                        </span>
                    </div>

                    <div className="flex gap-6">
                        <Link to="/" className="hover:text-white transition-colors">PRIVACY</Link>
                        <Link to="/" className="hover:text-white transition-colors">TERMS</Link>
                        <Link to="/sitemap.xml" className="hover:text-white transition-colors">SITEMAP</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
