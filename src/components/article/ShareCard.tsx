import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShareCardProps {
    title: string;
    category: string;
    author: string;
    excerpt: string;
    onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ title, category, author, excerpt, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);
    const { t } = useTranslation();

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setGenerating(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                // @ts-ignore
                scale: 2, // High resolution
                backgroundColor: null,
                useCORS: true
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `global-pulse-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-white/10 animate-scale-in">
                {/* Header Actions */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* The Card to Caption */}
                <div ref={cardRef} className="relative p-8 min-h-[500px] flex flex-col justify-between overflow-hidden">
                    {/* Dynamic Backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

                    {/* Content */}
                    <div className="relative z-10 text-white flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] border border-white/30 px-3 py-1 rounded-full">
                                {category}
                            </span>
                            <span className="font-display font-bold text-xl tracking-tight">Global Pulse</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="w-12 h-1 bg-cyan-400 mb-6" />
                            <h2 className="text-3xl font-display font-bold leading-tight mb-6 text-shadow-lg">
                                "{title}"
                            </h2>
                            <p className="font-serif italic text-white/80 text-lg leading-relaxed">
                                {excerpt.substring(0, 100)}...
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                                {author.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{author}</p>
                                <p className="text-xs opacity-60">Read more at global-pulse.news</p>
                            </div>
                            <div className="ml-auto">
                                <ImageIcon size={24} className="opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-900 p-6 flex flex-col gap-4">
                    <button
                        onClick={handleDownload}
                        disabled={generating}
                        className="w-full py-4 rounded-xl bg-white text-slate-900 font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {generating ? (
                            <span className="animate-pulse">Generating...</span>
                        ) : (
                            <>
                                <Download size={20} />
                                {t('article.download_card', 'Download Image')}
                            </>
                        )}
                    </button>
                    <p className="text-center text-slate-500 text-xs">
                        {t('article.share_hint', 'Save image and post to Instagram/Twitter')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareCard;
