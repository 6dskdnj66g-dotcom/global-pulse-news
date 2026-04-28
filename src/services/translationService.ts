// Translation Service - Securly routed via Backend API
// Implements caching to avoid repeated API calls

// Simple in-memory cache for translations
const translationCache: Record<string, string> = {};

export const translateToArabic = async (text: string): Promise<string> => {
    // Return from cache if available
    const cacheKey = text.substring(0, 100);
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    // Skip translation if text looks like it's already Arabic
    if (/[\u0600-\u06FF]/.test(text.substring(0, 20))) {
        return text;
    }

    try {
        // SECURITY FIX: Route through Backend to prevent exposing API_KEY
        const response = await fetch('/api/groq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{
                    role: 'user',
                    content: `Translate the following text to Arabic. Return ONLY the Arabic translation, nothing else:\n\n"${text}"`
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            console.warn('Translation API error:', response.status);
            return text; // Fallback
        }

        const data = await response.json();
        
        // Match the backend API format ({ text: string })
        const translated = data.text;

        if (translated) {
            // Remove quotes if they wrap the translation
            const cleaned = translated.replace(/^["']|["']$/g, '').trim();
            translationCache[cacheKey] = cleaned;
            return cleaned;
        }

        return text;
    } catch (error) {
        console.warn('Translation secure routing error:', error);
        return text; // Return original on error
    }
};

// Batch translate multiple texts for efficiency
export const batchTranslateToArabic = async (texts: string[]): Promise<string[]> => {
    const needsTranslation = texts.filter(t => !translationCache[t.substring(0, 100)]);

    if (needsTranslation.length === 0) {
        return texts.map(t => translationCache[t.substring(0, 100)] || t);
    }

    // Process concurrently
    const results = await Promise.all(texts.map(t => translateToArabic(t)));
    return results;
};
