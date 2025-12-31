import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-primary transition-colors text-sm"
        >
            <Globe size={14} />
            <span>
                {i18n.language === 'ar' ? 'English' : 'عربي'}
            </span>
        </button>
    );
};
