import { useState, useEffect } from 'react';
import { Article } from '../data/mockData';

const SAVED_ARTICLES_KEY = 'global_pulse_saved_articles_v1';

export const useSavedArticles = () => {
    const [savedArticles, setSavedArticles] = useState<Article[]>([]);

    // Load saved articles from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(SAVED_ARTICLES_KEY);
        if (stored) {
            try {
                setSavedArticles(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse saved articles:', e);
            }
        }
    }, []);

    // Helper to check if article is saved
    const isSaved = (articleId: string | number) => {
        return savedArticles.some(a => a.id.toString() === articleId.toString());
    };

    // Toggle save status
    const toggleSave = (article: Article) => {
        setSavedArticles(prev => {
            const exists = prev.some(a => a.id.toString() === article.id.toString());
            let newArticles;
            if (exists) {
                // Remove
                newArticles = prev.filter(a => a.id.toString() !== article.id.toString());
            } else {
                // Add
                newArticles = [article, ...prev];
            }

            // Persist to local storage
            localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(newArticles));
            return newArticles;
        });
    };

    return {
        savedArticles,
        isSaved,
        toggleSave,
        count: savedArticles.length
    };
};
