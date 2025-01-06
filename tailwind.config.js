// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// module.exports = {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//       extend: {},
//   },
//   plugins: [],
// };


module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff7f8',
        },
        purple: {
          700: '#6b46c1',
          600: '#805ad5',
          100: '#faf5ff',
        },
      },
    },
  },
  plugins: [],
};
