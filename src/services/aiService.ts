// AI Service - Professional AI Chatbot Integration
// Uses Groq API for intelligent, high-speed responses

interface AIResponse {
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

// Direct API (used in DEV if VITE_GROQ_API_KEY is set)
const DIRECT_GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEV_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const callAIDirect = async (messages: object[], generationConfig: any): Promise<string> => {
    const response = await fetch(DIRECT_GROQ_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEV_API_KEY}`
        },
        body: JSON.stringify({ 
            messages, 
            model: "llama-3.3-70b-versatile",
            temperature: generationConfig.temperature,
            max_completion_tokens: generationConfig.maxOutputTokens
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Direct API Error: ${response.status} ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('No content from direct API');
    return text;
};

const callAIBackend = async (messages: object[], generationConfig: any): Promise<string> => {
    const apiUrl = '/api/groq';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, generationConfig })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || response.statusText;
        console.error('AI API Error Details:', errorData);

        if (response.status === 500) {
            return `⚠️ Server Error: ${errorData.details || errorData.error || 'Please try again later'}`;
        }
        if (response.status === 429) return `⚠️ Rate limit exceeded. Try again later.`;

        throw new Error(`API Request Failed: ${response.status} ${errorMessage}`);
    }

    const data = await response.json() as AIResponse;
    if (data.text) return data.text;
    return "⚠️ No content generated. Try rephrasing.";
};

export const askAI = async (userMessage: string): Promise<string> => {
    const messages = [
        { role: 'system', content: SYSTEM_CONTEXT },
        { role: 'user', content: userMessage }
    ];
    
    const generationConfig = {
        temperature: 0.7,
        maxOutputTokens: 1024,
    };

    try {
        // In DEV mode: use direct API if key available, else try production backend
        if (import.meta.env.DEV && DEV_API_KEY) {
            return await callAIDirect(messages, generationConfig);
        }
        // In production (or DEV without key): use backend endpoint
        return await callAIBackend(messages, generationConfig);
    } catch (error: any) {
        // If direct API failed in DEV, try backend as fallback
        if (import.meta.env.DEV && DEV_API_KEY) {
            try {
                return await callAIBackend(messages, generationConfig);
            } catch {
                // both failed
            }
        }
        console.error('AI Fetch Error:', error);
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
    const messages = [
        { role: 'system', content: ARTICLE_EXPANSION_PROMPT },
        { role: 'user', content: `Category: ${category}\nHeadline: ${title}\nBrief: ${excerpt}\n\nWrite the expanded article content:` }
    ];
    const generationConfig = {
        temperature: 0.7,
        maxOutputTokens: 2048,
    };

    try {
        // In DEV mode: use direct API if key available
        if (import.meta.env.DEV && DEV_API_KEY) {
            return await callAIDirect(messages, generationConfig);
        }
        return await callAIBackend(messages, generationConfig);
    } catch (error: any) {
        // If direct API failed in DEV, try backend as fallback
        if (import.meta.env.DEV && DEV_API_KEY) {
            try {
                return await callAIBackend(messages, generationConfig);
            } catch {
                // both failed
            }
        }
        console.error('Article Expansion Error:', error);
        return ''; // Return empty on error, will fall back to original content
    }
};
