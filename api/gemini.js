import { GoogleGenerativeAI } from '@google/generative-ai';

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // CORS configuration
    const allowedOrigins = ['https://globalpulse.social', 'http://localhost:5173', 'http://localhost:3000'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // === INPUT VALIDATION ===
    if (!req.body || !req.body.contents) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    // Rate Limiting / Abuse Prevention (Content Length)
    const requestSize = JSON.stringify(req.body).length;
    if (requestSize > 10000) { // Limit to ~10KB payload
        return res.status(413).json({ error: 'Payload too large' });
    }

    const { contents, generationConfig } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('SERVER ERROR: GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'Service temporarily unavailable' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use a consistent model alias
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: contents,
            generationConfig: {
                ...generationConfig,
                maxOutputTokens: Math.min(generationConfig?.maxOutputTokens || 1024, 2048) // Cap tokens to prevent abuse
            }
        });

        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });

    } catch (error) {
        console.error('Gemini API Error:', error.message); // Log full error internally

        // === SECURE ERROR RESPONSE ===
        // Do NOT leak stack traces or internal details to the client
        return res.status(500).json({
            error: 'AI content generation failed',
            details: 'The service encountered an error. Please try again.'
        });
    }
}
