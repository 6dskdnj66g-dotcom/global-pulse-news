import { Article, mockArticles } from '../data/mockData';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: Array<{
        source: { id: string | null; name: string };
        author: string | null;
        title: string;
        description: string | null;
        url: string;
        urlToImage: string | null;
        publishedAt: string;
        content: string | null;
    }>;
}

export const fetchNews = async (category?: string): Promise<Article[]> => {
    // If no API key or in development without key, use mock data
    if (!API_KEY) {
        console.warn('No API Key found, using mock data');
        if (category) {
            return Promise.resolve(mockArticles.filter(a => a.category.toLowerCase() === category.toLowerCase()));
        }
        return Promise.resolve(mockArticles);
    }

    try {
        const endpoint = category
            ? `${BASE_URL}/top-headlines?category=${category}&language=en&apiKey=${API_KEY}`
            : `${BASE_URL}/top-headlines?language=en&apiKey=${API_KEY}`;

        const response = await fetch(endpoint);
        const data: NewsResponse = await response.json();

        if (data.status !== 'ok') {
            throw new Error('API Error');
        }

        return data.articles.map((item, index) => ({
            id: index.toString(), // NewsAPI doesn't allow robust IDs, using index for now
            title: item.title,
            excerpt: item.description || '',
            category: category ? (category.charAt(0).toUpperCase() + category.slice(1)) as any : 'General',
            imageUrl: item.urlToImage || 'https://via.placeholder.com/600x400?text=No+Image', // Fallback image
            date: new Date(item.publishedAt).toLocaleDateString(),
            author: item.author || 'Unknown'
        }));
    } catch (error) {
        console.error('Failed to fetch news:', error);
        // Fallback to mock data on error
        if (category) {
            return mockArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
        }
        return mockArticles;
    }
};

export const fetchBreakingNews = async (): Promise<string[]> => {
    if (!API_KEY) {
        return Promise.resolve([
            "🔴 BREAKING: Major diplomatic summit begins today with world leaders gathering to discuss global security",
            "🌍 WORLD: Historic peace agreement signed between nations after months of negotiations",
            "⚡ URGENT: International humanitarian mission launched to assist disaster-affected regions",
            "🔴 BREAKING: World Health Organization announces major breakthrough in disease prevention",
            "🌐 GLOBAL: United Nations Security Council convenes emergency session on international crisis"
        ]);
    }

    try {
        const response = await fetch(`${BASE_URL}/top-headlines?language=en&apiKey=${API_KEY}`);
        const data: NewsResponse = await response.json();
        return data.articles.slice(0, 5).map(a => a.title);
    } catch (error) {
        return ["Breaking: API quota exceeded or error, showing placeholder ticker."];
    }
};
