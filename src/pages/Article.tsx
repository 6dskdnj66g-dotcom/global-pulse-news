import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { mockArticles } from '../data/mockData';
import { Calendar, User, Clock, Share2, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useTranslation } from 'react-i18next';
import NewsCard from '../components/news/NewsCard';

const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const article = mockArticles.find(a => a.id === id);
    const isRtl = i18n.language === 'ar';

    if (!article) {
        return (
            <Layout>
                <SEO title={t('common.not_found')} />
                <div className="container px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('common.not_found')}</h2>
                </div>
            </Layout>
        );
    }

    const relatedArticles = mockArticles
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 4);

    return (
        <Layout>
            <SEO
                title={article.title}
                description={article.excerpt}
                image={article.imageUrl}
                type="article"
            />
            <article className={`container px-4 pb-16 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`}>
                {/* Article Header */}
                <header className={`my-8 md:mb-12 max-w-4xl mx-auto ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 px-3 py-1 rounded-full">
                        {t(`nav.${article.category.toLowerCase()}`)}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold mt-6 leading-tight text-secondary dark:text-white font-serif">
                        {article.title}
                    </h1>

                    <div className={`flex flex-wrap ${isRtl ? 'justify-end' : 'justify-start'} gap-6 mt-6 text-slate-500 text-sm border-b border-border pb-6`}>
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{t('common.min_read', { count: 5 })}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="rounded-xl overflow-hidden max-h-[600px] mb-12 shadow-2xl relative group">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Article Content */}
                <div className="max-w-3xl mx-auto">
                    <div className="prose dark:prose-invert prose-xl font-serif">
                        <p className={`text-xl md:text-2xl leading-relaxed mb-10 text-slate-800 dark:text-slate-200 font-medium italic ${isRtl ? 'border-r-8' : 'border-l-8'} border-primary/40 ${isRtl ? 'pr-8' : 'pl-8'}`}>
                            {article.excerpt}
                        </p>

                        <div
                            className="text-slate-700 dark:text-slate-300 space-y-8 article-body text-lg md:text-xl leading-loose"
                            dangerouslySetInnerHTML={{ __html: article.content || `<p>${t('common.content_coming_soon')}</p>` }}
                        />
                    </div>

                    {/* Share Actions */}
                    <div className={`mt-16 pt-8 border-t border-border flex flex-wrap items-center gap-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-sm font-bold uppercase tracking-widest text-muted">{t('common.share')}:</span>
                        <div className="flex gap-2">
                            <button className="p-3 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                    <section className="mt-24 border-t border-border pt-16">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-serif font-black uppercase tracking-tighter">
                                {t('common.related_articles')}
                            </h2>
                            <Link to={`/category/${article.category.toLowerCase()}`} className="group flex items-center gap-2 text-primary-accent font-bold text-sm uppercase tracking-widest hover:underline">
                                {t('common.view_all')}
                                {isRtl ? <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedArticles.map(article => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </Layout>
    );
};

export default ArticlePage;
