import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for now, or specify your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

    const { contents, generationConfig } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Fallback to widely available v1.0 model

        // Determine if it's a chat history or single prompt
        // The frontend sends `contents` array which is compatible with generateContent

        // For single prompt or chat, generateContent works if contents is formatted correctly
        const result = await model.generateContent({
            contents: contents,
            generationConfig: generationConfig
        });

        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });

    } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({
            error: error.message || 'Failed to generate content',
            details: error.toString()
        });
    }
}
