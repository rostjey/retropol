// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
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
      colors: {
        retrored: "#751813",
        retrohover: "#a42a1e",
      },
    },
  },
  plugins: [],
}
