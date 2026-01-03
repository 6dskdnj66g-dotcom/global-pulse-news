// Gemini AI Service - Professional AI Chatbot Integration
// Uses Google's Gemini API for intelligent responses

// Gemini API keys should be set in Vercel Environment Variables
// The backend function /api/gemini handles the secret key securely

interface GeminiResponse {
    text: string;
}

// System context for the AI
const SYSTEM_CONTEXT = `You are "Pulse AI", a highly intelligent and friendly AI assistant for Global Pulse News - a global news aggregator website.

Your capabilities:
1. Answer ANY question on ANY topic (science, history, coding, math, philosophy, etc.)
2. Provide news analysis and context
3. Help with translations (Arabic/English)
4. Explain complex topics simply
5. Be helpful, accurate, and professional

Guidelines:
- Be concise but thorough
- If asked in Arabic, respond in Arabic
- If asked in English, respond in English
- Be friendly and conversational
- Cite sources when discussing current events
- Admit when you don't know something
- Never generate harmful or inappropriate content

You are integrated into a news website called "Global Pulse | النبض العالمي".`;

export const askGeminiAI = async (userMessage: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: SYSTEM_CONTEXT },
                            { text: `User question: ${userMessage}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || response.statusText;
            console.error('Gemini API Error Details:', errorData);

            if (response.status === 500) return `⚠️ Server Error: Please try again later.`;
            if (response.status === 429) return `⚠️ Rate limit exceeded. Try again later.`;

            throw new Error(`API Request Failed: ${response.status} ${errorMessage}`);
        }

        const data = await response.json() as GeminiResponse;

        if (data.text) {
            return data.text;
        }

        return "⚠️ No content generated. Try rephrasing.";

    } catch (error: any) {
        console.error('Gemini AI Fetch Error:', error);
        return `⚠️ Connection Error: ${error.message}`;
    }
};


