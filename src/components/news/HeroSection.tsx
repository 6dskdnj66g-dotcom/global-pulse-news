import React from 'react';
import { Article } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
    article: Article;
}

const HeroSection: React.FC<HeroSectionProps> = ({ article }) => {
    const navigate = useNavigate();

    return (
        <section className="container mb-12 py-8 border-b border-black dark:border-white animate-fade-in">
            <div
                onClick={() => navigate(`/article/${article.id}`, { state: { article } })}
                className="cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
                {/* Main Content (Left on Desktop) */}
                <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
                    <div className="flex items-center gap-3">
                        <span className="bg-primary-accent text-white px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest">
                            Breaking
                        </span>
                        <span className="text-xs font-sans uppercase tracking-widest text-muted">
                            {article.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] group-hover:underline decoration-primary-accent decoration-4 underline-offset-4">
                        {article.title}
                    </h1>

                    <p className="text-lg text-foreground/80 font-serif leading-relaxed line-clamp-4">
                        {article.excerpt}
                    </p>

                    <div className="mt-2 text-xs font-sans font-bold uppercase tracking-wide text-foreground/60">
                        By {article.author} • {article.date}
                    </div>
                </div>

                {/* Hero Image (Right on Desktop) */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    <div className="aspect-[16/9] w-full overflow-hidden border border-black/10 dark:border-white/10">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] grayscale-[20%] group-hover:grayscale-0"
                        />
                    </div>
                    <p className="text-[10px] text-right text-muted mt-2 font-sans uppercase tracking-wider">
                        Photo courtesy of Global Pulse Agencies
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
