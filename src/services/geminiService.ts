// Gemini AI Service - Professional AI Chatbot Integration
// Uses Google's Gemini API for intelligent responses

// Gemini API keys are designed for frontend use with domain restrictions
// The key is restricted to your domain in Google AI Studio for security
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBwGcy_GS8EFec1ZMqPGdRosM6pRKn4St8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
    candidates?: Array<{
        content: {
            parts: Array<{ text: string }>;
        };
    }>;
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
    // Check if API key is available
    if (!GEMINI_API_KEY) {
        return "⚠️ API Key is missing. Please check configuration.";
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
            const errorMessage = errorData.error?.message || response.statusText;
            console.error('Gemini API Error Details:', errorData);

            if (response.status === 400) return `⚠️ Error 400: Invalid Request. (${errorMessage})`;
            if (response.status === 403) return `⚠️ Error 403: Origin/Referrer blocked or Key Invalid. Check API Key restrictions in Google AI Studio.`;
            if (response.status === 429) return `⚠️ Error 429: Rate limit exceeded. Try again later.`;

            throw new Error(`API Request Failed: ${response.status} ${errorMessage}`);
        }

        const data: GeminiResponse = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        return "⚠️ No content generated. Try rephrasing.";
    } catch (error: any) {
        console.error('Gemini AI Fetch Error:', error);
        return `⚠️ Connection Error: ${error.message}`;
    }
};


