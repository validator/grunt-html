'use strict';

const fs = require('fs');
const path = require('path');
const expectedResults = require('./helpers/expected_results.js');
const run = require('./helpers/run.js');

describe('htmllint', () => {
  describe('all', () => {
    it('with relative paths', done => {
      const options = {
        files: ['test/fixtures/valid.html', 'test/fixtures/invalid.html'],
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = expectedResults.invalid;

      run(options, expected, 'four errors from test/fixtures/invalid.html', done);
    });

    it('with absolute paths', done => {
      const options = {
        files: ['test/fixtures/valid.html', 'test/fixtures/invalid.html'],
        absoluteFilePathsForReporter: true,
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = expectedResults.invalid.map(result => {
        return {
          file: path.resolve(result.file),
          type: result.type,
          message: result.message,
          lastLine: result.lastLine,
          lastColumn: result.lastColumn
        };
      });

      run(options, expected, 'four errors from test/fixtures/invalid.html', done);
    });
  });

  describe('empty', () => {
    it('with relative paths', done => {
      const options = {
        files: [],
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = [];

      run(options, expected, '0 errors from 0 files', done);
    });
  });

  describe('bad-encoding', () => {
    it('with relative paths', done => {
      const options = {
        files: [path.normalize('test/fixtures/invalid-encoding.html')],
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = [{
        file: path.normalize('test/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Malformed byte sequence: “e1”.',
        lastLine: 5,
        lastColumn: 9
      },
      {
        file: path.normalize('test/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Malformed byte sequence: “e1”.',
        lastLine: 9,
        lastColumn: 18
      },
      {
        file: path.normalize('test/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Internal encoding declaration “iso-8859-1” disagrees with the actual encoding of the document (“utf-8”).',
        lastLine: 4,
        lastColumn: 72
      },
      {
        file: path.normalize('test/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Bad value “text/html; charset=iso-8859-1” for attribute “content” on element “meta”: “charset=” must be followed by “utf-8”.',
        lastLine: 4,
        lastColumn: 72
      }];

      run(options, expected, '', done);
    });
  });

  describe('ignore', () => {
    it('with relative paths', done => {
      const options = {
        ignore: [
          'The "clear" attribute on the "br" element is obsolete. Use CSS instead.',
          'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          /attribute “[a-z]+” not allowed/i
        ],
        files: [
          path.normalize('test/fixtures/valid.html'),
          path.normalize('test/fixtures/invalid.html')
        ],
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = [{
        file: path.normalize('test/fixtures/invalid.html'),
        type: 'error',
        message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
        lastLine: 9,
        lastColumn: 96
      }];

      run(options, expected, 'one error from test/fixtures/invalid.html, other three were ignored', done);
    });

    it('with string ignore', done => {
      const options = {
        ignore: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
        files: [
          path.normalize('test/fixtures/valid.html'),
          path.normalize('test/fixtures/no-doctype.html')
        ],
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = [];

      run(options, expected, '0 errors from 0 files', done);
    });
  });

  describe('no-lang', () => {
    it('default options', done => {
      const options = {
        files: ['test/fixtures/no-lang.html'],
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = [{
        file: path.normalize('test/fixtures/no-lang.html'),
        type: 'info',
        message: 'Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.',
        lastLine: 2,
        lastColumn: 6
      }];

      run(options, expected, '1 errors from 1 files', done);
    });

    it('noLangDetect: true', done => {
      const options = {
        files: ['test/fixtures/no-lang.html'],
        errorlevels: ['info', 'warning', 'error'],
        noLangDetect: true
      };
      const expected = [];

      run(options, expected, '0 errors from 0 files', done);
    });
  });

  describe('many files', () => {
    it('many files to test if results are overwritten', done => {
      const dir = path.normalize('./test/fixtures/many-files/');
      const files = fs.readdirSync(dir)
        .filter(file => path.extname(file) === '.html')
        .map(file => path.join(dir, file));

      const options = {
        files,
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = ['001', '050', '100'].map(num => ({
        file: path.normalize(`test/fixtures/many-files/test-file-with-a-pretty-long-name-to-reach-maximum-length-sooner-${num}.html`),
        type: 'error',
        message: 'Element “title” must not be empty.',
        lastLine: 3,
        lastColumn: 15
      }));

      run(options, expected, '3 errors from 3 files', done);
    });
  });
});
