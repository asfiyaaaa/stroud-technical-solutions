import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#E8EDF5',
                    100: '#C5D0E6',
                    200: '#9FB2D4',
                    300: '#7894C2',
                    400: '#5B7DB5',
                    500: '#3E66A8',
                    600: '#345899',
                    700: '#294785',
                    800: '#1B3A5C',
                    900: '#0A1628',
                },
                steel: {
                    50: '#F5F6F8',
                    100: '#E8EAED',
                    200: '#D0D4DA',
                    300: '#B0B7C0',
                    400: '#8E97A3',
                    500: '#6B7B8D',
                    600: '#566474',
                    700: '#434E5B',
                    800: '#313943',
                    900: '#1F252D',
                },
                accent: {
                    DEFAULT: '#2196F3',
                    light: '#64B5F6',
                    dark: '#1565C0',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Outfit', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': 'linear-gradient(135deg, #0A1628 0%, #1B3A5C 50%, #294785 100%)',
            },
        },
    },
    plugins: [],
};
export default config;
