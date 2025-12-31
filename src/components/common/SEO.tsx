import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = 'https://global-pulse.vercel.app/og-image.jpg',
    type = 'website'
}) => {
    const { t, i18n } = useTranslation();

    const siteTitle = t('app.title');
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || t('footer.about_desc');
    const currentLang = i18n.language;

    return (
        <Helmet>
            {/* Basic */}
            <html lang={currentLang} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} />
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
