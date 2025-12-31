import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = 'https://global-pulse-news.vercel.app/og-image.jpg',
    type = 'website',
    keywords
}) => {
    const { t, i18n } = useTranslation();

    const siteTitle = t('app.title');
    const siteName = 'Global Pulse | النبض العالمي';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || 'موقع إخباري عالمي يقدم آخر الأخبار من BBC, Reuters, Al Jazeera والمزيد. Global news from trusted sources.';
    const currentLang = i18n.language;

    // Default keywords for SEO
    const defaultKeywords = 'النبض العالمي, Global Pulse, أخبار عالمية, أخبار حية, BBC Arabic, Reuters, Al Jazeera, news, breaking news, أخبار عاجلة, رياضة, اقتصاد, تكنولوجيا, سياسة';
    const metaKeywords = keywords || defaultKeywords;

    return (
        <Helmet>
            {/* Basic */}
            <html lang={currentLang} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} />
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="author" content="Global Pulse Team" />
            <meta name="robots" content="index, follow" />

            {/* Canonical URL */}
            <link rel="canonical" href="https://global-pulse-news.vercel.app" />

            {/* Alternate Languages */}
            <link rel="alternate" hrefLang="ar" href="https://global-pulse-news.vercel.app/?lang=ar" />
            <link rel="alternate" hrefLang="en" href="https://global-pulse-news.vercel.app/?lang=en" />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={currentLang === 'ar' ? 'ar_SA' : 'en_US'} />
            <meta property="og:url" content="https://global-pulse-news.vercel.app" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@GlobalPulseNews" />

            {/* Schema.org JSON-LD for Rich Search Results */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "NewsMediaOrganization",
                    "name": "Global Pulse | النبض العالمي",
                    "alternateName": ["النبض العالمي", "Global Pulse", "نبض الحياة"],
                    "url": "https://global-pulse-news.vercel.app",
                    "logo": "https://global-pulse-news.vercel.app/logo.png",
                    "sameAs": [
                        "https://global-pulse-news.netlify.app",
                        "https://github.com/6dskdnj66g-dotcom/global-pulse-news"
                    ],
                    "description": "موقع إخباري عالمي يقدم آخر الأخبار من مصادر موثوقة - Global news aggregator"
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
