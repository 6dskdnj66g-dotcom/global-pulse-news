export default async function handler(req, res) {
    // CORS configuration
    const allowedOrigins = ['https://globalpulse.social', 'http://localhost:5173', 'http://localhost:3000'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Support both naming conventions
    const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;

    if (!apiKey) {
        console.error('SERVER ERROR: NEWS_API_KEY is missing');
        return res.status(500).json({ error: 'News API Configuration Error' });
    }

    const category = req.query.category;
    const isBreaking = req.query.breaking === 'true';

    const BASE_URL = 'https://newsapi.org/v2';
    
    try {
        let endpoint = '';
        if (isBreaking) {
            endpoint = `${BASE_URL}/top-headlines?language=en&apiKey=${apiKey}`;
        } else if (category && category !== 'undefined') {
            endpoint = `${BASE_URL}/top-headlines?category=${category}&language=en&apiKey=${apiKey}`;
        } else {
            endpoint = `${BASE_URL}/top-headlines?language=en&apiKey=${apiKey}`;
        }

        const response = await fetch(endpoint);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('NewsAPI Upstream Error:', response.status, errorText);
            return res.status(response.status).json({ error: 'Upstream Provider Error' });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Internal News API Fetch Error:', error);
        return res.status(500).json({ error: 'Failed to fetch news from provider' });
    }
}
