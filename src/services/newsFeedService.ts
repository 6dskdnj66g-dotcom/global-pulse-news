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

// === EXPANDED GLOBAL NEWS SOURCES ===
const ALL_FEEDS = [
    // ===== INTERNATIONAL ENGLISH =====
    { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'Politics' },
    { name: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Economy' },
    { name: 'BBC Tech', url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', category: 'Politics' },
    { name: 'Reuters Top', url: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best', category: 'Economy' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Politics' },
    { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', category: 'Politics' },
    { name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'Politics' },
    { name: 'Axios Main', url: 'https://www.axios.com/feeds/feed.rss', category: 'Politics' },
    { name: 'Axios Econ', url: 'https://api.axios.com/feed/', category: 'Economy' },

    // ===== TECHNOLOGY =====
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'Technology' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Technology' },

    // ===== SPORTS =====
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', category: 'Sports' },
    { name: 'BBC Sport', url: 'http://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports' },
    { name: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', category: 'Sports' },
    { name: 'Marca (Spain)', url: 'https://e00-marca.uecdn.es/rss/portada.xml', category: 'Sports' },
    { name: 'AS (Spain)', url: 'https://as.com/rss/tags/ultimas_noticias.xml', category: 'Sports' },

    // ===== MAGAZINES & CULTURE =====
    { name: 'The Economist', url: 'https://www.economist.com/the-world-this-week/rss.xml', category: 'Economy' },
    { name: 'TIME Magazine', url: 'https://time.com/feed/', category: 'Culture' },
    { name: 'Forbes', url: 'https://www.forbes.com/business/feed/', category: 'Economy' },
    { name: 'National Geographic', url: 'https://www.nationalgeographic.com/rss/index.xml', category: 'Culture' },

    // ===== ECONOMY =====
    { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'Economy' },
    { name: 'Financial Times', url: 'https://www.ft.com/world?format=rss', category: 'Economy' },
];

const getProImage = (category: string, fallback?: string): string => {
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Technology'];
    if (fallback && fallback.startsWith('http') && !fallback.includes('logo') && !fallback.includes('icon')) {
        return fallback;
    }
    return images[Math.floor(Math.random() * images.length)];
};

// Format real publish time
const formatRealTime = (pubDate: string): string => {
    const date = new Date(pubDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// === FETCH SINGLE REAL NEWS ===
export const fetchRealNews = async (): Promise<Article | null> => {
    try {
        const feed = ALL_FEEDS[Math.floor(Math.random() * ALL_FEEDS.length)];
        const response = await fetch(`${RSS_TO_JSON}${encodeURIComponent(feed.url)}`);
        const data = await response.json();

        if (data.status === 'ok' && data.items?.length > 0) {
            const item = data.items[Math.floor(Math.random() * data.items.length)];
            return {
                id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: item.title?.replace(/<[^>]*>/g, '') || 'Breaking News',
                excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'Latest update from trusted sources.',
                imageUrl: getProImage(feed.category, item.thumbnail || item.enclosure?.link),
                category: feed.category,
                author: feed.name,
                date: formatRealTime(item.pubDate),
                isBreaking: true,
                source: feed.name,
                sourceUrl: item.link || '#'
            };
        }
    } catch (error) {
        console.error('RSS Fetch Error:', error);
    }
    return null;
};

// === Fetch news by category ===
export const fetchNewsByCategory = async (category: string): Promise<Article[]> => {
    const articles: Article[] = [];
    const categoryFeeds = ALL_FEEDS.filter(f => f.category.toLowerCase() === category.toLowerCase());

    for (const feed of categoryFeeds.slice(0, 3)) {
        try {
            const response = await fetch(`${RSS_TO_JSON}${encodeURIComponent(feed.url)}`);
            const data = await response.json();

            if (data.status === 'ok' && data.items?.length > 0) {
                const items = data.items.slice(0, 4);
                items.forEach((item: any, index: number) => {
                    articles.push({
                        id: `cat-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
                        title: item.title?.replace(/<[^>]*>/g, '') || 'News Update',
                        excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 180) + '...' || 'Read more.',
                        imageUrl: getProImage(feed.category, item.thumbnail || item.enclosure?.link),
                        category: feed.category,
                        author: feed.name,
                        date: formatRealTime(item.pubDate),
                        isBreaking: false,
                        source: feed.name,
                        sourceUrl: item.link || '#'
                    });
                });
            }
        } catch (error) {
            console.error(`Error fetching ${feed.name}:`, error);
        }
    }

    return articles;
};

// === BATCH FETCH for fast loading ===
export const fetchBatchRealNews = async (count: number = 12): Promise<Article[]> => {
    const shuffledFeeds = [...ALL_FEEDS].sort(() => Math.random() - 0.5);

    const fetchPromises = shuffledFeeds.slice(0, Math.min(count, shuffledFeeds.length)).map(async (feed) => {
        try {
            const response = await fetch(`${RSS_TO_JSON}${encodeURIComponent(feed.url)}`);
            const data = await response.json();

            if (data.status === 'ok' && data.items?.length > 0) {
                const item = data.items[0];
                return {
                    id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: item.title?.replace(/<[^>]*>/g, '') || 'Latest News',
                    excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'Breaking update.',
                    imageUrl: getProImage(feed.category, item.thumbnail || item.enclosure?.link),
                    category: feed.category,
                    author: feed.name,
                    date: formatRealTime(item.pubDate),
                    isBreaking: Math.random() > 0.7,
                    source: feed.name,
                    sourceUrl: item.link || '#'
                };
            }
        } catch {
            return null;
        }
    });

    const results = await Promise.all(fetchPromises);
    return results.filter(a => a !== null && a !== undefined) as Article[];
};
