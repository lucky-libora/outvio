module.exports = {
  extends: ['eslint-config-airbnb', 'prettier', 'plugin:prettier/recommended'],
  root: true,
  env: {
    browser: false,
    commonjs: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'max-len': ['error', { code: 120 }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: 'if', next: '*' },
    ],
    semi: ['error', 'never'],
    'no-console': 'error',
    'consistent-return': ['off'],
    radix: ['off'],
  },
  ignorePatterns: ['node_modules', 'dist'],
}
