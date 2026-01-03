// Gemini AI Service - Professional AI Chatbot Integration
// Uses Google's Gemini API for intelligent responses

const GEMINI_API_KEY = 'AIzaSyBy3T3Obr_mYll-gwpE0OKPi0X2qB-N0yI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
        return getSmartFallbackResponse(userMessage);
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
            throw new Error('Gemini API request failed');
        }

        const data: GeminiResponse = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        return getSmartFallbackResponse(userMessage);
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return getSmartFallbackResponse(userMessage);
    }
};

// Fallback responses when API is unavailable
const getSmartFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    const isArabic = /[\u0600-\u06FF]/.test(query);

    // Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('مرحبا') || q.includes('السلام')) {
        return isArabic
            ? 'مرحباً! أنا Pulse AI، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟'
            : 'Hello! I\'m Pulse AI, your intelligent assistant. How can I help you today?';
    }

    // Weather
    if (q.includes('weather') || q.includes('طقس')) {
        return isArabic
            ? 'يمكنك رؤية الطقس الحالي في أعلى الصفحة. الطقس يتم تحديثه تلقائياً حسب موقعك!'
            : 'You can see the current weather at the top of the page. It updates automatically based on your location!';
    }

    // News
    if (q.includes('news') || q.includes('أخبار') || q.includes('خبر')) {
        return isArabic
            ? 'نقدم لك أحدث الأخبار من مصادر عالمية موثوقة مثل BBC, Reuters, Al Jazeera وغيرها. تصفح الأقسام المختلفة للمزيد!'
            : 'We bring you the latest news from trusted global sources like BBC, Reuters, Al Jazeera and more. Browse different categories for more!';
    }

    // Default
    return isArabic
        ? 'شكراً لسؤالك! للحصول على إجابات أكثر تفصيلاً، يرجى التأكد من تفعيل مفتاح Gemini API. في الوقت الحالي، يمكنني مساعدتك في التنقل بين الأخبار والأقسام المختلفة.'
        : 'Thanks for your question! For more detailed answers, please ensure the Gemini API key is configured. Currently, I can help you navigate news and different sections.';
};
