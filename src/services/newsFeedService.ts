import { Article } from '../data/mockData';

// Public RSS-to-JSON proxy
const RSS_TO_JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

// === PROFESSIONAL FALLBACK IMAGES BY CATEGORY ===
const CATEGORY_IMAGES: Record<string, string[]> = {
    Politics: [
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80'
    ],
    Economy: [
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'
    ],
    Technology: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
    ],
    Sports: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80'
    ],
    Culture: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&q=80'
    ]
};

// === EXPANDED FEEDS ===
const ALL_FEEDS = [
    { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'Politics' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Politics' },
    { name: 'Reuters Business', url: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best', category: 'Economy' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', category: 'Sports' },
    { name: 'Marca (Spain)', url: 'https://e00-marca.uecdn.es/rss/portada.xml', category: 'Sports' },
    { name: 'AS (Spain)', url: 'https://as.com/rss/tags/ultimas_noticias.xml', category: 'Sports' }
];

const getProImage = (category: string, fallback?: string): string => {
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Technology'];
    if (fallback && fallback.startsWith('http')) return fallback;
    return images[Math.floor(Math.random() * images.length)];
};

// === FETCH SINGLE REAL NEWS ===
export const fetchRealNews = async (): Promise<Article | null> => {
    try {
        const feed = ALL_FEEDS[Math.floor(Math.random() * ALL_FEEDS.length)];
        const response = await fetch(`${RSS_TO_JSON}${encodeURIComponent(feed.url)}`);
        const data = await response.json();

        if (data.status === 'ok' && data.items?.length > 0) {
            const item = data.items[Math.floor(Math.random() * data.items.length)];
            const plainExcerpt = item.description?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

            return {
                id: `real-${Date.now()}-${Math.random()}`,
                title: item.title,
                excerpt: plainExcerpt || 'Click to read full story from the source.',
                category: feed.category as any,
                imageUrl: getProImage(feed.category, item.enclosure?.link || item.thumbnail),
                date: new Date().toISOString().split('T')[0],
                author: item.author || feed.name,
                source: feed.name,
                sourceUrl: item.link,
                isBreaking: Math.random() > 0.8
            };
        }
        return null;
    } catch (error) {
        return null;
    }
};

// === FETCH BATCH REAL NEWS (FOR INSTANT LOAD) ===
export const fetchBatchRealNews = async (count: number = 8): Promise<Article[]> => {
    const articles: Article[] = [];
    const shuffledFeeds = [...ALL_FEEDS].sort(() => 0.5 - Math.random()).slice(0, 6); // Pick 6 random feeds to query

    const promises = shuffledFeeds.map(async (feed) => {
        try {
            const response = await fetch(`${RSS_TO_JSON}${encodeURIComponent(feed.url)}`);
            const data = await response.json();
            if (data.status === 'ok' && data.items?.length > 0) {
                // Get top 2 items from this feed
                return data.items.slice(0, 2).map((item: any) => ({
                    id: `batch-${Date.now()}-${Math.random()}`,
                    title: item.title,
                    excerpt: (item.description?.replace(/<[^>]+>/g, '').substring(0, 140) + '...') || 'Latest update from global wires.',
                    category: feed.category as any,
                    imageUrl: getProImage(feed.category, item.enclosure?.link || item.thumbnail),
                    date: new Date().toISOString().split('T')[0],
                    author: item.author || feed.name,
                    source: feed.name,
                    sourceUrl: item.link,
                    isBreaking: false
                }));
            }
        } catch (e) {
            return [];
        }
        return [];
    });

    const results = await Promise.all(promises);
    results.forEach(batch => {
        if (batch) articles.push(...batch);
    });

    return articles.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const fetchNewsByCategory = async (category: string): Promise<Article[]> => {
    const categoryFeeds = ALL_FEEDS.filter(f => f.category.toLowerCase() === category.toLowerCase());
    if (categoryFeeds.length === 0) return [];

    const articles: Article[] = [];

    // Parallel fetch for speed
    const promises = categoryFeeds.map(async (feed) => {
        try {
            const response = await fetch(`${RSS_TO_JSON}${encodeURIComponent(feed.url)}`);
            const data = await response.json();
            if (data.status === 'ok' && data.items?.length > 0) {
                return data.items.slice(0, 4).map((item: any) => ({
                    id: `cat-${Date.now()}-${Math.random()}`,
                    title: item.title,
                    excerpt: (item.description?.replace(/<[^>]+>/g, '').substring(0, 150) + '...') || 'Click to read full story.',
                    category: feed.category as any,
                    imageUrl: getProImage(feed.category, item.enclosure?.link || item.thumbnail),
                    date: new Date().toISOString().split('T')[0],
                    author: item.author || feed.name,
                    source: feed.name,
                    sourceUrl: item.link,
                    isBreaking: false
                }));
            }
        } catch (e) { return []; }
        return [];
    });

    const results = await Promise.all(promises);
    results.forEach(batch => {
        if (batch) articles.push(...batch);
    });

    return articles;
};
