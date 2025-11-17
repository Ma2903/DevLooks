module.exports = {
    content: [
      './index.html',
      './view/**/*.{vue,js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // Habilita dark mode via classe
    theme: {
      extend: {
        colors: {
          // Cores customizadas para o tema
          primary: {
            DEFAULT: '#04d1b0',
            dark: '#059669',
          },
          secondary: {
            DEFAULT: '#4e44e1',
            dark: '#4338ca',
          }
        }
      },
    },
    plugins: [],
  }