module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // Keep fast-refresh hint but do not fail CI on it
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // We don't use prop-types in this project (React 18 + TS in some files / inferred props)
    'react/prop-types': 'off',
    // Don't flag global React import as unused when using the new JSX transform
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' }],
    // Keep this as warning locally; CI won't fail on warnings as we removed --max-warnings
    'react-hooks/exhaustive-deps': 'warn',
  },
}
