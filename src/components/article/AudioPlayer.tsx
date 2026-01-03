import React, { useState, useEffect } from 'react';
import { Play, Pause, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AudioPlayerProps {
    text: string;
    title: string;
    lang: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, title, lang }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    // const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null); // Removed unused
    const [progress, setProgress] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handlePlay = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
            return;
        }

        const newUtterance = new SpeechSynthesisUtterance(`${title}. ${text}`);

        // Try to find appropriate voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith(lang));
        if (preferredVoice) newUtterance.voice = preferredVoice;

        newUtterance.lang = lang;
        newUtterance.rate = 1.0;
        newUtterance.pitch = 1.0;

        newUtterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(0);
        };

        newUtterance.onboundary = (event) => {
            // Simple progress estimation based on character index
            const length = text.length + title.length;
            const charIndex = event.charIndex;
            setProgress(Math.min((charIndex / length) * 100, 100));
        };

        // setUtterance(newUtterance);
        window.speechSynthesis.speak(newUtterance);
        setIsPlaying(true);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
    };

    return (
        <div className="fixed bottom-20 right-4 md:right-8 z-40 animate-slide-up">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-indigo-500/20 shadow-lg rounded-full p-1.5 flex items-center gap-2 pr-4">

                <button
                    onClick={handlePlay}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                >
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </button>

                <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500">
                        {isPlaying ? t('common.listening', 'Now Listening') : t('common.listen', 'Listen')}
                    </span>
                    <div className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-0.5 overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {isPlaying && (
                    <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-2 bg-indigo-500 rounded-full animate-music-bar-1" />
                        <span className="w-0.5 h-3 bg-indigo-500 rounded-full animate-music-bar-2" />
                        <span className="w-0.5 h-1.5 bg-indigo-500 rounded-full animate-music-bar-3" />
                    </div>
                )}

                {(isPlaying || isPaused) && (
                    <button onClick={handleStop} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AudioPlayer;
