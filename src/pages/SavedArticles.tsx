import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useSavedArticles } from '../hooks/useSavedArticles';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { ArrowRight, Trash2, Bookmark } from 'lucide-react';

const SavedArticles: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { savedArticles, toggleSave } = useSavedArticles();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <Layout>
            <SEO title={t('nav.saved', 'Saved Articles')} />

            <div className="min-h-screen pt-32 pb-20 px-4">
                <div className="container max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                {t('nav.saved', 'Saved Articles')}
                            </span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-center max-w-2xl">
                            {savedArticles.length === 0
                                ? t('saved.empty', 'You haven\'t saved any articles yet. Bookmark articles to read them later.')
                                : t('saved.count', { count: savedArticles.length, defaultValue: `You have ${savedArticles.length} saved articles.` })
                            }
                        </p>
                    </div>

                    {savedArticles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Bookmark size={64} className="mb-6 text-slate-300 dark:text-slate-600" />
                            <p className="text-xl font-medium text-slate-400">
                                {t('saved.empty_state', 'Your reading list is empty')}
                            </p>
                            <Link to="/" className="mt-8 px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors">
                                {t('common.browse_news', 'Browse News')}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {savedArticles.map((item) => (
                                <Link
                                    to={`/article/${item.id}`}
                                    key={item.id}
                                    state={{ article: item }}
                                    className="group relative flex flex-col h-full"
                                >
                                    <article className="h-full flex flex-col">
                                        <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3] shadow-lg">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                    {t(`nav.${item.category.toLowerCase()}`, { defaultValue: item.category })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1 relative -mt-12 mx-4 mb-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/5 shadow-lg">
                                            <div className="flex items-center gap-2 text-[10px] text-indigo-500 dark:text-indigo-400 font-bold mb-3 uppercase tracking-widest">
                                                <span>{item.source}</span>
                                                <span className="w-1 h-1 rounded-full bg-indigo-500/50" />
                                                <span>{item.date}</span>
                                            </div>

                                            <h3 className="text-xl font-display font-bold mb-3 leading-tight text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                                <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-2 transition-transform duration-300">
                                                    {t('home.read_more')}
                                                    <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleSave(item);
                                                        }}
                                                        className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                        aria-label="Remove Article"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SavedArticles;
