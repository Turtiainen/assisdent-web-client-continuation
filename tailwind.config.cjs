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
                'ad-subsidebar': colors['ad-grey-50'],
                bgSecond: {
                  light: '#ebe8fb',
                  DEFAULT: '#ebe8fb',
                },
                mainButton: {
                  DEFAULT: '0074e8',
                },
                boldText: {
                  DEFAULT: '#23408f',
                },
                normalText: {
                  DEFAULT: '#505a64'
                }
            },
            screens: {
                'mobileKeyboard': { 'raw': '(max-height: 540px)' },
                'mobile': { 'raw': '(max-width: 720px)' },
                'notMobile': { 'raw': '(min-width: 720px)' },
            },
            minHeight: {
                '0': '0',
                '1/4': '25%',
                '1/2': '50%',
                '3/4': '75%',
                'full': '100%',
            },
            backgroundImage: theme => ({
                'background-ig': "url('../src/styles/background.jpg')",
                'background-blue': "url('../src/styles/background_blue.png')"
            })
        },
    },
    plugins: [],
};
