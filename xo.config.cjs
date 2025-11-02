'use strict';

const globals = require('globals');

module.exports = [
  {
    space: true,
    rules: {
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@stylistic/max-len': 'off',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'after'],
      '@stylistic/space-before-function-paren': ['error', 'never'],
      'arrow-body-style': 'off',
      'capitalized-comments': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prevent-abbreviations': 'off'
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  }
];
