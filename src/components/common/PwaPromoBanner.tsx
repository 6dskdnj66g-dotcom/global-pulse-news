import React, { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed',
        platform: string
    }>;
    prompt(): Promise<void>;
}

export const PwaPromoBanner: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    if (!isInstallable) return null;

    return (
        <div className="container max-w-6xl mx-auto px-4 mb-16 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between border border-white/10 group">
                {/* Background Glass Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-indigo-500/30 transition-colors duration-700 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-start md:w-2/3 mb-8 md:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <Smartphone size={24} />
                        </span>
                        <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                            {isRtl ? 'الإصدار المحمول' : 'Mobile Edition'}
                        </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                        {isRtl ? 'احصل على النبض العالمي في جيبك!' : 'Get Global Pulse in your Pocket!'}
                    </h2>
                    
                    <p className="text-indigo-100/70 text-base md:text-lg max-w-lg mx-auto md:mx-0 font-light">
                        {isRtl 
                            ? 'حمّل التطبيق الرسمي الآن واستمتع بقراءة الأخبار دون إنترنت، ومساعد الذكاء الاصطناعي، في تجربة استثنائية وخالية من الإعلانات.'
                            : 'Install our App for offline AI access, instant breaking news, and a premium ad-free reading experience.'}
                    </p>
                </div>

                <div className="relative z-10 md:w-1/3 flex justify-center md:justify-end">
                    <button
                        onClick={handleInstallClick}
                        className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-white text-indigo-950 font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <Download size={24} className="group-hover:-translate-y-1 transition-transform" />
                        <span>{isRtl ? 'حمّل التطبيق الآن 📥' : 'Install App Now 📥'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PwaPromoBanner;
