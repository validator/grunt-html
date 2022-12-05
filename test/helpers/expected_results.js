'use strict';

const path = require('node:path');

const file = path.normalize('test/fixtures/invalid.html');

module.exports = {
  invalid: [
    {
      lastLine: 1,
      lastColumn: 16,
      type: 'error',
      message: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
      file
    },
    {
      lastLine: 9,
      lastColumn: 96,
      type: 'error',
      message: 'Attribute “unknownattr” not allowed on element “img” at this point.',
      file
    },
    {
      lastLine: 9,
      lastColumn: 96,
      type: 'error',
      message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
      file
    },
    {
      lastLine: 11,
      lastColumn: 17,
      type: 'error',
      message: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.',
      file
    }
  ],
  server: {
    invalid: [
      {
        lastLine: undefined,
        lastColumn: undefined,
        type: 'error',
        message: 'The character encoding was not declared. Proceeding using \'windows-1252\'.',
        file
      },
      {
        lastLine: 1,
        lastColumn: 16,
        type: 'error',
        message: 'Start tag seen without seeing a doctype first. Expected \'<!DOCTYPE html>\'.',
        file
      },
      {
        lastLine: 9,
        lastColumn: 96,
        type: 'error',
        message: 'Attribute \'unknownattr\' not allowed on element \'img\' at this point.',
        file
      },
      {
        lastLine: 9,
        lastColumn: 96,
        type: 'error',
        message: 'An \'img\' element must have an \'alt\' attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
        file
      },
      {
        lastLine: 11,
        lastColumn: 17,
        type: 'error',
        message: 'The \'clear\' attribute on the \'br\' element is obsolete. Use CSS instead.',
        file
      }
    ]
  }
};
