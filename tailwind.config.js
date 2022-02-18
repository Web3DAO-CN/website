const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screen: {
        '4xl': '1680px'
      },
      colors: {
        orange: colors.orange
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
