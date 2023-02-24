/** @type {import('tailwindcss').Config} */
const theme = require("tailwindcss/defaultTheme.js");
const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'ad-primary': '#0074e8',
                'ad-primary-hover': '#0c88ff',
                'ad-primary-pressed': '#0062c0',
                'ad-warning': '#ff8200',
                'ad-warning-hover': '#ff9614',
                'ad-warning-pressed': '#eb6e00',
                'ad-error': '#dc1414',
                'ad-error-hover': '#f02828',
                'ad-error-pressed': '#c80000',
                'ad-required': '#ec7fbc',
                'ad-required-hover': '#d9017a',
                'ad-hero-title': '#23408f',
                'ad-link': colors['ad-primary'],
                'ad-subtitle': '#88c1ff',
                'ad-grey': {
                    50: '#f8f9fb',
                    100: '#eff3f7',
                    200: '#e2e9ee',
                    300: '#d2dce6',
                    400: '#becad7',
                    500: '#9baab9',
                    600: '#7f8e9d',
                    700: '#647382',
                    800: '#4b5a69',
                    900: '#28323c'
                },
                'ad-gray': colors['ad-grey'],
                'ad-disabled': colors['ad-grey-400'],
                'ad-caption': colors['ad-grey-800'],
                'ad-sidebar': '#162f72',
                'ad-subsidebar': colors['ad-grey-50']
            },
        },
    },
    plugins: [],
};
