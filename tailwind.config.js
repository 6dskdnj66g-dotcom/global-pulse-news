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
            padding: '2rem',
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                background: "var(--color-background)",
                foreground: "var(--color-text)",
                muted: "var(--color-muted)",
                border: "var(--color-border)",
                paper: "var(--color-paper)",
                // Aurora Palette
                primary: {
                    DEFAULT: "#6366f1", // Indigo 500
                    hover: "#4f46e5",   // Indigo 600
                    light: "#818cf8",   // Indigo 400
                },
                secondary: {
                    DEFAULT: "#a855f7", // Purple 500
                    hover: "#9333ea",   // Purple 600
                },
                accent: {
                    DEFAULT: "#06b6d4", // Cyan 500
                    hover: "#0891b2",   // Cyan 600
                },
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'Cairo', 'sans-serif'], // Modern sans
                display: ['Space Grotesk', 'Outfit', 'sans-serif'], // Futuristic headers
            },
            backgroundImage: {
                'aurora': "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)",
                'glass-gradient': "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'tilt': 'tilt 10s infinite linear',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                tilt: {
                    '0%, 50%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(1deg)' },
                    '75%': { transform: 'rotate(-1deg)' },
                },
            },
        },
    },
    plugins: [],
}
