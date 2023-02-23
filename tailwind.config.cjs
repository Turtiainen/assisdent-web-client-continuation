/** @type {import('tailwindcss').Config} */
const theme = require("tailwindcss/defaultTheme.js");
const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'ad-blue': {
                    50: '#0062c0',
                    100: '#0062c0',
                    200: '#0c88ff',
                    300: '#0c88ff',
                    400: '#0074e8',
                    500: '#0074e8',
                    600: '#0062c0',
                    700: '#0062c0',
                    800: '#162f72',
                    900: '#23408f'
                },
                'ad-grey': {
                    50: '#eff3f7',
                    100: '#eff3f7',
                    200: '#eff3f7',
                    300: '#eff3f7',
                    400: '#eff3f7',
                    500: '#eff3f7',
                    600: '#eff3f7',
                    700: '#eff3f7',
                    800: '#eff3f7',
                    900: '#eff3f7'
                },
                'ad-gray': colors['ad-grey']
            },
        },
    },
    plugins: [],
};
