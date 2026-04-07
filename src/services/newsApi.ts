import { Article, mockArticles } from '../data/mockData';

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
    try {
        const endpoint = category
            ? `/api/news?category=${encodeURIComponent(category.toLowerCase())}`
            : `/api/news`;

        const response = await fetch(endpoint);
        
        if (!response.ok) {
            console.warn('API Error (Backend) or missing key, falling back to mock data');
            throw new Error('API Error');
        }

        const data: NewsResponse = await response.json();

        if (data.status !== 'ok') {
            throw new Error('NewsAPI Error Code');
        }

        return data.articles.map((item, index) => ({
            id: index.toString(), // NewsAPI doesn't allow robust IDs, using index for now
            title: item.title,
            excerpt: item.description || '',
            content: item.content || undefined,
            category: category ? (category.charAt(0).toUpperCase() + category.slice(1)) as any : 'General',
            imageUrl: item.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600', // Fallback image
            date: new Date(item.publishedAt).toLocaleDateString(),
            author: item.author || 'Unknown',
            source: item.source.name,
            sourceUrl: item.url
        }));
    } catch (error) {
        console.error('Failed to fetch news from backend API:', error);
        // Fallback to mock data on error or if api/news key is missing
        if (category) {
            return mockArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
        }
        return mockArticles;
    }
};

export interface TickerItem {
    title: string;
    url?: string;
}

export const fetchBreakingNews = async (): Promise<TickerItem[]> => {
    try {
        const response = await fetch(`/api/news?breaking=true`);
        
        if (!response.ok) {
            throw new Error('Upstream backend error');
        }

        const data: NewsResponse = await response.json();

        return data.articles.slice(0, 5).map(a => ({
            title: a.title,
            url: a.url
        }));
    } catch (error) {
        console.warn('Backend/API error falling back to Breaking placeholder', error);
        return [
            { title: "🔴 BREAKING: Major diplomatic summit begins today with world leaders gathering to discuss global security", url: "#" },
            { title: "🌍 WORLD: Historic peace agreement signed between nations after months of negotiations", url: "#" },
            { title: "⚡ URGENT: International humanitarian mission launched to assist disaster-affected regions", url: "#" }
        ];
    }
};
