import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Article as ArticleType, mockArticles } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Share2, Clock, Calendar, User, Newspaper, Tag, Check, Type, Image as ImageIcon } from 'lucide-react';
import SEO from '../components/common/SEO';
import AudioPlayer from '../components/article/AudioPlayer';
import ShareCard from '../components/article/ShareCard';

import { saveArticleToDb, getArticleFromDb } from '../services/articleService';

const Article: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [article, setArticle] = useState<ArticleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Feature States
    const [showShareCard, setShowShareCard] = useState(false);
    const [fontSize, setFontSize] = useState(18); // Default 18px (lg)

    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        const loadArticle = async () => {
            setLoading(true);

            // Priority 0: Check for encoded data in URL (INSTANT LOAD - no network needed)
            const urlParams = new URLSearchParams(window.location.search);
            const encodedData = urlParams.get('data');
            if (encodedData) {
                try {
                    const decoded = JSON.parse(decodeURIComponent(encodedData));
                    const instantArticle = {
                        id: id || 'shared',
                        title: decoded.t,
                        excerpt: decoded.e,
                        imageUrl: decoded.i,
                        author: decoded.a || 'Global Pulse',
                        category: decoded.c || 'News',
                        source: decoded.s || 'Global Pulse',
                        date: decoded.d || new Date().toISOString(),
                        sourceUrl: decoded.u,
                        isBreaking: false
                    };
                    setArticle(instantArticle as any);
                    setLoading(false);
                    // Save to DB for future clean URL access
                    saveArticleToDb(instantArticle as any);
                    return;
                } catch (e) {
                    console.log('Failed to parse URL data, falling back to DB');
                }
            }

            // Priority 1: Check if article data was passed via navigation state (Real News)
            if (location.state?.article) {
                setArticle(location.state.article);
                setLoading(false);
                // Background Save: Persist to DB for future direct access
                saveArticleToDb(location.state.article);
                return;
            }

            // Priority 2: Check if it's a mock article (Static Data)
            const foundMock = mockArticles.find(a => a.id === id);
            if (foundMock) {
                setArticle(foundMock);
                setLoading(false);
                return;
            }

            // Priority 3: Try to fetch from Firestore (Database persistence)
            if (id) {
                const dbArticle = await getArticleFromDb(id);
                if (dbArticle) {
                    setArticle(dbArticle);
                    setLoading(false);
                    return;
                }
            }

            // Fallback: Article not found anywhere
            setArticle(null);
            setLoading(false);
        };

        loadArticle();
    }, [id, location.state]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen pt-32 container max-w-4xl mx-auto px-4">
                    <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-8" />
                    <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mb-8" />
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                </div>
            </Layout>
        );
    }

    if (!article) {
        return (
            <Layout>
                <div className="min-h-screen pt-32 container max-w-2xl mx-auto px-4 text-center">
                    <div className="glass-panel p-12 rounded-2xl">
                        <Newspaper size={64} className="mx-auto text-slate-400 mb-6" />
                        <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">
                            {t('article.not_found_title', 'Article Not Found')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            {t('article.not_found_message', 'This article may have expired or the link is invalid.')}
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all"
                        >
                            {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                            {t('article.back_to_home', 'Back to Home')}
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    // Generate key points from excerpt (split into sentences for cleaner display)
    const getKeyPoints = () => {
        const categoryKey = article.category.toLowerCase() as 'politics' | 'economy' | 'technology' | 'sports' | 'culture';
        const contextPoints = t(`article.context.${categoryKey}`, { returnObjects: true });
        const points = Array.isArray(contextPoints) ? contextPoints : [];

        // Extract key sentences from excerpt for summary bullets
        const excerptSentences = article.excerpt
            .split(/[.!?]+/)
            .filter(s => s.trim().length > 20)
            .slice(0, 2)
            .map(s => s.trim() + '.');

        return [...excerptSentences, ...points.slice(0, 2)];
    };

    const keyPoints = getKeyPoints();

    const handleShare = async () => {
        const url = window.location.href;
        const text = `Check out this article: ${article.title}`;

        // Cast navigator to any to satisfy TypeScript if the Share API types aren't available
        if ((navigator as any).share) {
            try {
                await (navigator as any).share({
                    title: article.title,
                    text: article.excerpt,
                    url: url,
                });
                return; // Shared successfully
            } catch (error) {
                console.log('Error sharing:', error);
                // Fallback to clipboard
            }
        }

        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Layout>
            <SEO
                title={article.title}
                description={article.excerpt}
                image={article.imageUrl}
                schemaType="article"
                articleData={{ publishedAt: new Date().toISOString(), author: article.author }}
            />

            <article className="min-h-screen pb-20 relative overflow-hidden">
                {/* Immersive Background Blur */}
                <div className="fixed top-0 left-0 w-full h-[60vh] -z-10">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-20 blur-2xl dark:opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
                </div>

                <div className="container max-w-4xl mx-auto px-4 pt-32">
                    {/* Header Badge */}
                    <div className="flex justify-center mb-8 animate-float">
                        <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                            <Tag size={12} />
                            {t(`nav.${article.category.toLowerCase()}`, { defaultValue: article.category })}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-center mb-8 leading-tight text-glow">
                        {article.title}
                    </h1>

                    {/* Meta Data Pill */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted mb-12">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 bg-white/50 dark:bg-slate-900/50">
                            <User size={14} className="text-indigo-500" />
                            <span>{article.author}</span>
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 bg-white/50 dark:bg-slate-900/50">
                            <Calendar size={14} className="text-indigo-500" />
                            <span>{article.date}</span>
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 bg-white/50 dark:bg-slate-900/50">
                            <Clock size={14} className="text-indigo-500" />
                            <span>3 min read</span>
                        </div>
                    </div>

                    {/* Main Image 3D */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105 transform group-hover:rotate-x-1"
                        />
                        {article.source && (
                            <div className="absolute bottom-6 right-6 z-20 glass-panel px-4 py-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    Source: {article.source}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Container */}
                    <div className="glass-panel p-8 md:p-12 relative">
                        {/* Reading Tools (Sticky) */}
                        <div className="sticky top-24 z-30 flex justify-end gap-2 mb-4">
                            <div className="glass-panel p-1 flex items-center gap-1 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                                <button
                                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Decrease Font Size"
                                >
                                    <Type size={14} />
                                </button>
                                <span className="text-xs font-bold w-6 text-center">{fontSize}</span>
                                <button
                                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Increase Font Size"
                                >
                                    <Type size={18} />
                                </button>
                            </div>
                            <button
                                onClick={() => setShowShareCard(true)}
                                className="glass-panel p-3 bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-colors"
                                title="Create Viral Image"
                            >
                                <ImageIcon size={18} />
                            </button>
                        </div>

                        {/* Summary Box - Key Points Only */}
                        <div className="mb-12 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-6 border-l-4 border-indigo-500">
                            <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                                    <Newspaper size={18} />
                                </div>
                                {t('article.summary_title', 'Summary')}
                            </h2>
                            <ul className="space-y-3">
                                {keyPoints.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-base">
                                        <span className="text-indigo-500 font-bold">•</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Article Preview Content */}
                        <div className="mb-8 relative">
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none font-sans leading-loose text-slate-800 dark:text-slate-300 transition-all duration-300"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-500 first-letter:float-left first-letter:mr-3 mb-6">
                                    {article.excerpt}
                                </p>

                                {article.content ? (
                                    <div className="space-y-6">
                                        {/* Display content, handling both HTML mock data and plain text API data */}
                                        {article.content.split('\n').map((paragraph, idx) => (
                                            paragraph.trim() && (
                                                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\[\+\d+ chars\]/, '') }} />
                                            )
                                        ))}
                                        {article.content.includes('[+') && (
                                            <p className="italic opacity-70 border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-lg">
                                                {t('article.preview_only', 'This is a preview of the full article.')}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="opacity-80">
                                            {t('article.read_full_prompt', 'Read the full story at the source below.')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Fade Out Effect */}
                            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent flex items-end justify-center pb-8" />
                        </div>

                        {/* Premium Read Full Story Button */}
                        <div className="flex flex-col items-center gap-6 mb-12 relative z-10">
                            <a
                                href={article.sourceUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative flex items-center gap-3 group-hover:text-white transition-colors">
                                    {t('article.read_full', 'Read Full Story')}
                                    {isRtl ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                                </span>
                            </a>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                                {t('article.read_source', 'Continue reading at')} {article.source}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider group"
                                >
                                    {copied ? <Check size={18} /> : <Share2 size={18} />}
                                    {copied ? t('article.copied', 'Copied!') : t('article.share', 'Share Article')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Sticky Audio Player */}
            <AudioPlayer
                text={article.excerpt + " " + (article.content || "").replace(/<[^>]+>/g, ' ')}
                title={article.title}
                lang={i18n.language}
            />

            {/* Viral Share Modal */}
            {showShareCard && (
                <ShareCard
                    title={article.title}
                    category={article.category}
                    author={article.author}
                    excerpt={article.excerpt}
                    imageUrl={article.imageUrl}
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </Layout>
    );
};

export default Article;
