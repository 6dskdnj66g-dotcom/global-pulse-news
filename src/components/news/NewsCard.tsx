import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Bookmark, Share2 } from 'lucide-react';
import { Article } from '../../data/mockData';
import Tilt from 'react-parallax-tilt';

interface NewsCardProps {
    article: Article;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.some((b: Article) => b.id === article.id));
    }, [article.id]);

    const toggleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        let newBookmarks;

        if (isBookmarked) {
            newBookmarks = bookmarks.filter((b: Article) => b.id !== article.id);
        } else {
            newBookmarks = [...bookmarks, article];
        }

        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const shareUrl = article.sourceUrl || (window.location.origin + `/article/${article.id}`);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: shareUrl
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied!');
        }
    };

    return (
        <Tilt
            tiltMaxAngleX={2}
            tiltMaxAngleY={2}
            scale={1.02}
            transitionSpeed={2000}
            className="h-full"
        >
            {/* Always link internally, pass article data via state */}
            <Link
                to={`/article/${article.id}`}
                state={{ article }}
                className="group block h-full bg-paper dark:bg-zinc-900 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-500 hover:shadow-xl relative overflow-hidden"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                            {article.category}
                        </span>
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={toggleBookmark}
                            className={`p-2 rounded-full backdrop-blur-md transition-colors ${isBookmarked ? 'bg-primary text-white' : 'bg-black/30 text-white hover:bg-black/50'}`}
                        >
                            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-md transition-colors"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>

                    {/* Source Badge */}
                    {article.source && (
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white text-[10px] font-bold px-2 py-1 backdrop-blur-sm">
                            Via {article.source}
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col h-full border-t border-black/5 dark:border-white/5">
                    <h3 className="text-xl md:text-2xl font-serif font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                    </h3>

                    <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-3 font-serif opacity-80">
                        {article.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-xs text-muted/60 font-sans border-t border-black/5 dark:border-white/5 pt-4">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <User size={12} /> {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {article.date}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </Tilt>
    );
};

export default NewsCard;
