import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Article } from '../data/mockData';

const COLLECTION_NAME = 'articles';

/**
 * Generates a unique short ID for an article based on its title.
 * Uses a simple hash function to create a 8-character alphanumeric ID.
 */
export const generateArticleId = (title: string): string => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to base36 (alphanumeric) and take 8 characters
    const id = Math.abs(hash).toString(36).substring(0, 8);
    return id.padEnd(8, '0'); // Ensure 8 characters
};

/**
 * Saves an article to Firestore.
 * This is designed to be a "fire and forget" operation in most cases.
 */
export const saveArticleToDb = async (article: Article) => {
    if (!article || !article.id) return;

    try {
        const articleRef = doc(db, COLLECTION_NAME, article.id);
        // We use setDoc with merge: true to avoid overwriting existing data if it exists,
        // but fully saving it if it's new.
        await setDoc(articleRef, {
            ...article,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log(`Article ${article.id} saved/updated in DB.`);
    } catch (error) {
        console.error("Error saving article to DB:", error);
    }
};

/**
 * Retrieves an article by ID from Firestore.
 */
export const getArticleFromDb = async (id: string): Promise<Article | null> => {
    try {
        const articleRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(articleRef);

        if (docSnap.exists()) {
            return docSnap.data() as Article;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching article from DB:", error);
        return null;
    }
};
