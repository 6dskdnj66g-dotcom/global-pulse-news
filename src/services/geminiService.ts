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
        // In development (localhost), point to the live Vercel backend
        // In production, use relative path
        const apiUrl = import.meta.env.DEV
            ? 'https://globalpulse.social/api/gemini'
            : '/api/gemini';

        const response = await fetch(apiUrl, {
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

            if (response.status === 500) {
                return `⚠️ Server Error: ${errorData.details || errorData.error || 'Please try again later'}`;
            }
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


// Article Content Expansion - Generate detailed content from title and excerpt
const ARTICLE_EXPANSION_PROMPT = `You are a professional news writer for Global Pulse News. Given a news headline and brief description, write a detailed, informative article expansion (3-4 paragraphs, about 250-350 words).

Guidelines:
- Write in a professional journalistic style
- Provide context and background information
- Explain the significance and implications
- Be factual and balanced
- Do NOT make up specific quotes or statistics
- Do NOT include any meta-commentary like "This article explains..."
- Write as if continuing the original article naturally
- Match the language of the input (Arabic or English)
- Use paragraph breaks for readability`;


export const expandArticleContent = async (title: string, excerpt: string, category: string): Promise<string> => {
    try {
        const apiUrl = import.meta.env.DEV
            ? 'https://globalpulse.social/api/gemini'
            : '/api/gemini';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: ARTICLE_EXPANSION_PROMPT },
                            { text: `Category: ${category}\nHeadline: ${title}\nBrief: ${excerpt}\n\nWrite the expanded article content:` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini Expansion Error:', errorData);
            return ''; // Return empty on error, will fall back to original content
        }

        const data = await response.json() as GeminiResponse;
        return data.text || '';

    } catch (error: any) {
        console.error('Article Expansion Error:', error);
        return '';
    }
};
