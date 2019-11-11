'use strict';

const path = require('path');

const invalidHtml = path.normalize('tests/fixtures/invalid.html');
const invalidPhp = path.normalize('tests/fixtures/invalid.php');

module.exports = {
  invalid: [
    {
      lastLine: 1,
      lastColumn: 16,
      type: 'error',
      message: `Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.`, // eslint-disable-line quotes
      file: invalidHtml
    },
    {
      lastLine: 10,
      lastColumn: 96,
      type: 'error',
      message: `Attribute “unknownattr” not allowed on element “img” at this point.`, // eslint-disable-line quotes
      file: invalidHtml
    },
    {
      lastLine: 10,
      lastColumn: 96,
      type: 'error',
      message: `An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.`, // eslint-disable-line quotes
      file: invalidHtml
    },
    {
      lastLine: 12,
      lastColumn: 19,
      type: 'error',
      message: `The “clear” attribute on the “br” element is obsolete. Use CSS instead.`, // eslint-disable-line quotes
      file: invalidHtml
    }
  ],
  invalidPhp: [
    {
      lastLine: 2,
      lastColumn: 16,
      type: 'error',
      message: `Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.`, // eslint-disable-line quotes
      file: invalidPhp
    },
    {
      lastLine: 10,
      lastColumn: 96,
      type: 'error',
      message: `Attribute “unknownattr” not allowed on element “img” at this point.`, // eslint-disable-line quotes
      file: invalidPhp
    },
    {
      lastLine: 10,
      lastColumn: 96,
      type: 'error',
      message: `An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.`, // eslint-disable-line quotes
      file: invalidPhp
    },
    {
      lastLine: 12,
      lastColumn: 19,
      type: 'error',
      message: `The “clear” attribute on the “br” element is obsolete. Use CSS instead.`, // eslint-disable-line quotes
      file: invalidPhp
    }
  ],
  noLang: [
    {
      lastLine: 2,
      lastColumn: 6,
      type: 'info',
      message: `Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.`, // eslint-disable-line quotes
      file: path.normalize('tests/fixtures/no-lang.html')
    }
  ]
};
