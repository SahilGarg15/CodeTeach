/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // ensure this is set to 'class'
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
            filter: 'blur(5px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
            filter: 'blur(0)'
          }
        },
        slideInLeft: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.98)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        slideDown: 'slideDown 0.15s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite',
        fadeInUp: 'fadeInUp 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.3s ease-out forwards',
        scaleIn: 'scaleIn 0.4s ease-out',
        fadeOut: 'fadeOut 150ms ease-out',
        fadeIn: 'fadeIn 300ms ease-in',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
      },
      typography: (theme) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.gray[100]'),
            '--tw-prose-links': theme('colors.emerald[400]'),
            '--tw-prose-bold': theme('colors.gray[100]'),
            '--tw-prose-code': theme('colors.emerald[400]'),
            '--tw-prose-quotes': theme('colors.gray[100]'),
          },
        },
      }),
      scrollbar: {
        thin: '6px',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ]
}