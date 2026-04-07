import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
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

export const InstallPwaPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI notify the user they can install the PWA
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if already installed
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
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    if (!isInstallable) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-full shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300"
            title="Install App"
        >
            <Download size={16} />
            <span className="hidden md:inline">{t('common.install_app', 'Install App')}</span>
        </button>
    );
};

export default InstallPwaPrompt;
