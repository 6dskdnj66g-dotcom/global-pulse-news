import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const saveContactMessage = async (email: string, message: string): Promise<boolean> => {
    try {
        await addDoc(collection(db, 'contact_messages'), {
            email,
            message,
            createdAt: serverTimestamp(),
            status: 'unread' // Allows the admin to filter unread messages in Firestore
        });
        return true;
    } catch (error) {
        console.error('Error saving contact message:', error);
        return false;
    }
};
