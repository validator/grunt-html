const path = require('path');
const htmllint = require('../lib/htmllint');
const expectedResults = require('./support/expected_results');

function run(test, config, expected, message) {
  test.expect(1);
  // tests here
  htmllint(config, (error, result) => {
    if (error) {
      throw error;
    }
    // copy only the properties we want to test
    // url property is absolute, system-dependend path
    result = result.map((msg) => {
      return {
        file: msg.file,
        type: msg.type,
        message: msg.message,
        lastLine: msg.lastLine,
        lastColumn: msg.lastColumn
      };
    });
    test.deepEqual(result, expected, message);
    test.done();
  });
}

exports.htmllint = {
  'all': {
    'with relative paths': (test) => {
      const expected = expectedResults.invalid;

      run(test, {
        files: ['test/valid.html', 'test/invalid.html'],
        errorlevels: ['info', 'warning', 'error']
      }, expected, 'four errors from test/invalid.html');
    },
    'with absolute paths': (test) => {
      const expected = expectedResults.invalid.map((result) => {
        return {
          file: path.resolve(result.file),
          type: result.type,
          message: result.message,
          lastLine: result.lastLine,
          lastColumn: result.lastColumn
        };
      });

      run(test, {
        files: ['test/valid.html', 'test/invalid.html'],
        absoluteFilePathsForReporter: true,
        errorlevels: ['info', 'warning', 'error']
      }, expected, 'four errors from test/invalid.html');
    }
  },
  'empty': (test) => {
    run(test, {
      files: [],
      errorlevels: ['info', 'warning', 'error']
    }, [], '0 errors from 0 files');
  },
  'bad-encoding': (test) => {
    run(test, {
      files: [path.join('test', 'invalid-encoding.html')],
      errorlevels: ['info', 'warning', 'error']
    }, [
      {
        file: path.join('test', 'invalid-encoding.html'),
        type: 'error',
        message: 'Malformed byte sequence: “e1”.',
        lastLine: 5,
        lastColumn: 9
      },
      {
        file: path.join('test', 'invalid-encoding.html'),
        type: 'error',
        message: 'Malformed byte sequence: “e1”.',
        lastLine: 9,
        lastColumn: 18
      },
      {
        file: path.join('test', 'invalid-encoding.html'),
        type: 'error',
        message: 'Internal encoding declaration “iso-8859-1” disagrees with the actual encoding of the document (“utf-8”).',
        lastLine: 4,
        lastColumn: 74
      },
      {
        file: path.join('test', 'invalid-encoding.html'),
        type: 'error',
        message: 'Bad value “text/html; charset=iso-8859-1” for attribute “content” on element “meta”: “charset=” must be followed by “utf-8”.',
        lastLine: 4,
        lastColumn: 74
      }
    ]);
  },
  'ignore': (test) => {
    run(test, {
      ignore: [
        'The "clear" attribute on the "br" element is obsolete. Use CSS instead.',
        'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
        /attribute “[a-z]+” not allowed/i
      ],
      files: ['test/valid.html', 'test/invalid.html'],
      errorlevels: ['info', 'warning', 'error']
    }, [
      {
        lastLine: 9,
        lastColumn: 96,
        type: 'error',
        message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
        file: path.join('test', 'invalid.html')
      }
    ], 'one error from test/invalid.html, other three were ignored');
  }
};
