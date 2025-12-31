import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentYear = new Date().getFullYear();
    const isRtl = i18n.language === 'ar';

    const footerLinks = {
        'news': ['politics', 'economy', 'technology', 'sports'],
        'opinion': ['editorials', 'columnists', 'letters'],
        'arts': ['books', 'music', 'art_design', 'theater'],
        'living': ['food', 'travel', 'health', 'style']
    };

    return (
        <footer className="footer bg-secondary/30 border-t border-black/10 dark:border-white/10 pt-12 pb-6 mt-auto">
            <div className="container px-4">
                {/* Newsletter Signup */}
                <div className={`border-b border-black/10 dark:border-white/10 pb-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 ${isRtl ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'}`}>
                    <div className="text-center md:text-left">
                        <h3 className="font-serif font-bold text-2xl mb-2">{t('footer.newsletter_title')}</h3>
                        <p className="text-sm text-muted">{t('footer.newsletter_desc')}</p>
                    </div>
                    <div className={`flex w-full md:w-auto gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <input
                            type="email"
                            placeholder={t('footer.newsletter_placeholder')}
                            className={`bg-background border border-black/20 dark:border-white/20 px-4 py-2 w-full md:w-64 focus:outline-none focus:border-primary-accent ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 font-bold text-sm uppercase tracking-widest transition-colors whitespace-nowrap">
                            {t('footer.subscribe')}
                        </button>
                    </div>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="font-serif font-black text-2xl mb-4 block">
                            {t('app.title')}
                        </Link>
                        <p className="text-xs text-muted leading-relaxed max-w-xs font-serif italic">
                            {t('footer.motto')}
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-sans font-bold uppercase text-[10px] tracking-widest text-foreground/80 mb-4">
                                {isRtl ? t(`footer.${category}`) || category : category}
                            </h4>
                            <ul className="space-y-2">
                                {links.map(link => (
                                    <li key={link}>
                                        <Link to="#" className="text-sm font-serif text-muted hover:text-primary-accent hover:underline decoration-1 underline-offset-2">
                                            {isRtl ? t(`footer.${link}`) || link : link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className={`border-t border-black/5 dark:border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-sans uppercase tracking-widest text-muted ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <span>{t('footer.copyright', { year: currentYear })}</span>

                    {/* Designer Credit */}
                    <div className="flex items-center gap-2 text-primary dark:text-accent">
                        <span className="text-[11px] font-bold">
                            {isRtl ? '✨ تم التصميم بواسطة حسنين صلاح' : '✨ Designed by Hassanein Salah'}
                        </span>
                    </div>

                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-foreground">{t('footer.privacy')}</Link>
                        <Link to="#" className="hover:text-foreground">{t('footer.terms')}</Link>
                        <Link to="#" className="hover:text-foreground">{t('footer.sitemap')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
