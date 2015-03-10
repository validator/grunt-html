'use strict';

var path = require('path');
var invalidHtml = path.join('test', 'invalid.html');

module.exports = {
  invalid: [
    {
      lastLine: 1,
      lastColumn: 16,
      type: 'error',
      message: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
      file: invalidHtml
    },
    {
      lastLine: 9,
      lastColumn: 96,
      type: 'error',
      message: 'Attribute “unknownattr” not allowed on element “img” at this point.',
      file: invalidHtml
    },
    {
      lastLine: 9,
      lastColumn: 96,
      type: 'error',
      message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
      file: invalidHtml
    },
    {
      lastLine: 11,
      lastColumn: 19,
      type: 'error',
      message: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.',
      file: invalidHtml
    }
  ]
};
