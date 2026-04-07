import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Global Pulse News',
                short_name: 'GlobalPulse',
                description: 'أخبار عالمية حية من مصادر موثوقة - Live global news from trusted sources',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                dir: 'rtl',
                lang: 'ar',
                icons: [
                    {
                        src: 'apple-touch-icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /\/api\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-responses',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // <== 24 hours
                            },
                            networkTimeoutSeconds: 10, // fallback to cache if network is slow
                        }
                    }
                ]
            }
        })
    ],
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
