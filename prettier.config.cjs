/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 4,
  semi: false,
  jsxSingleQuote: true,
  singleAttributePerLine: true,
  bracketSpacing: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}

module.exports = config
