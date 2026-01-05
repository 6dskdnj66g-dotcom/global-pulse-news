import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // React core libraries
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    // Firebase SDK
                    'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
                    // Internationalization
                    'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
                    // UI libraries
                    'ui-vendor': ['framer-motion', 'lucide-react', 'react-parallax-tilt'],
                    // Utilities
                    'utils-vendor': ['date-fns', 'html2canvas'],
                },
            },
        },
        // Optimize chunk size warnings threshold
        chunkSizeWarningLimit: 600,
    },
})
