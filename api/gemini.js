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
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); // Use lite version to avoid quota limits

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

        // Attempt to list models to help debug
        let availableModels = 'Could not fetch models';
        try {
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const listData = await listResponse.json();
            if (listData.models) {
                availableModels = listData.models.map(m => m.name).join(', ');
            }
        } catch (e) {
            availableModels = 'Failed to list models: ' + e.message;
        }

        return res.status(500).json({
            error: 'Model Error',
            details: `Failed to use model. Available models for your key: ${availableModels}. Original Error: ${error.message}`
        });
    }
}
