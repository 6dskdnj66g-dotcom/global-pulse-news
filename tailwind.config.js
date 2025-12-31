/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1.5rem', // Tighter newspaper padding
            screens: {
                "2xl": "1280px", // Standardize max width like a broadsheet
            },
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1a1a1a", // Ink Black (Primary action is subtle in papers)
                    hover: "#404040",
                    accent: "#b91c1c", // News Red (e.g., Breaking)
                },
                secondary: {
                    DEFAULT: "#f4f4f5", // Paper Gray
                    dark: "#18181b",
                },
                background: "var(--color-background)",
                foreground: "var(--color-text)",
                muted: "var(--color-muted)",
                border: "var(--color-border)",
                paper: "#fdfbf7", // Warm newsprint white
            },
            fontFamily: {
                sans: ['Inter', 'Amiri', 'sans-serif'], // Body text
                serif: ['Playfair Display', 'Amiri', 'serif'], // Headings
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            boxShadow: {
                'soft': 'none', // Remove shadows for flat design
                'card': '0 1px 3px rgba(0,0,0,0.05)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '65ch',
                        color: 'var(--color-text)',
                        h1: { fontFamily: 'Playfair Display, serif' },
                        h2: { fontFamily: 'Playfair Display, serif' },
                        h3: { fontFamily: 'Playfair Display, serif' },
                    },
                },
            },
        },
    },
    plugins: [],
}
