module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  rules: { '@typescript-eslint/no-explicit-any': 'off', '@typescript-eslint/explicit-function-return-type': 'off' },
  settings: {
    react: {
      createClass: 'createReactClass',
      version: 'detect'
    }
  }
};
