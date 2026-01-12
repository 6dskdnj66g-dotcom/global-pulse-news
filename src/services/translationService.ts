// Translation Service - Uses Gemini AI to translate content
// Implements caching to avoid repeated API calls

// Gemini API key MUST be set via VITE_GEMINI_API_KEY environment variable
// NEVER hardcode API keys - they will be leaked in the client bundle
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Simple in-memory cache for translations
const translationCache: Record<string, string> = {};

export const translateToArabic = async (text: string): Promise<string> => {
    // Return from cache if available
    const cacheKey = text.substring(0, 100); // Use first 100 chars as key
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    // Skip translation if text looks like it's already Arabic
    if (/[\u0600-\u06FF]/.test(text.substring(0, 20))) {
        return text;
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{
                        text: `Translate the following text to Arabic. Return ONLY the Arabic translation, nothing else:\n\n"${text}"`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            console.warn('Translation API error:', response.status);
            return text; // Return original on error
        }

        const data = await response.json();
        const translated = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (translated) {
            // Remove quotes if they wrap the translation
            const cleaned = translated.replace(/^["']|["']$/g, '').trim();
            translationCache[cacheKey] = cleaned;
            return cleaned;
        }

        return text;
    } catch (error) {
        console.warn('Translation error:', error);
        return text; // Return original on error
    }
};

// Batch translate multiple texts for efficiency
export const batchTranslateToArabic = async (texts: string[]): Promise<string[]> => {
    // Check which texts need translation
    const needsTranslation = texts.filter(t => !translationCache[t.substring(0, 100)]);

    if (needsTranslation.length === 0) {
        // All cached
        return texts.map(t => translationCache[t.substring(0, 100)] || t);
    }

    // For now, translate individually (could be optimized with batch API)
    const results = await Promise.all(texts.map(t => translateToArabic(t)));
    return results;
};
