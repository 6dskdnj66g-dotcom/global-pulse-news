import Groq from 'groq-sdk';

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
    if (!req.body || !req.body.messages) {
        return res.status(400).json({ error: 'Invalid request body, expected messages array' });
    }

    // Rate Limiting / Abuse Prevention (Content Length)
    const requestSize = JSON.stringify(req.body).length;
    if (requestSize > 10000) { // Limit to ~10KB payload
        return res.status(413).json({ error: 'Payload too large' });
    }

    const { messages, generationConfig } = req.body;
    
    // BACKUP: Support both env variable naming conventions
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        console.error('SERVER ERROR: API KEY is completely missing from environment variables');
        return res.status(500).json({ 
            error: 'Configuration Error', 
            details: 'API Key is missing in Vercel settings.' 
        });
    }

    try {
        const groq = new Groq({ apiKey });

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: generationConfig?.temperature || 0.7,
            max_completion_tokens: Math.min(generationConfig?.maxOutputTokens || 1024, 2048)
        });

        const text = chatCompletion.choices[0]?.message?.content || "";
        
        // Verify response exists
        if (!text) {
            throw new Error("No response string received from Groq.");
        }
        
        return res.status(200).json({ text });

    } catch (error) {
        console.error('Groq API Critical Error:', error); 

        return res.status(500).json({
            error: 'AI content generation failed',
            details: error.message || 'Unknown upstream service error occurred.'
        });
    }
}
