// tailwind.config.js
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // varsa
    ],
    theme: {
      extend: {
        animation: {
          pulseShadow: 'pulseShadow 3s ease-in-out infinite',
        },
        keyframes: {
          pulseShadow: {
            '0%, 100%': {
              boxShadow: '0 0 0px rgba(255, 165, 0, 0)',
            },
            '50%': {
              boxShadow: '0 0 25px rgba(255, 165, 0, 0.5)',
            },
          },
        },
      },
    },
    plugins: [],
  }
  