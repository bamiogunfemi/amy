import baseConfig from '../../packages/config/eslint.config.js'

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for API responses
    },
  },
]
