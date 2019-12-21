module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  settings: {
    react: {
      createClass: 'createReactClass',
      version: 'detect'
    }
  }
};
