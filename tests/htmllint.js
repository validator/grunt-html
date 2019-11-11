'use strict';

const path = require('path');
const assert = require('assert');
const htmllint = require('../lib/htmllint');
const expectedResults = require('./helpers/expected_results');

async function assertThrowsAsync(fn, regExp) {
  let f = () => {};
  try {
    await fn;
  } catch (error) {
    f = () => {
      throw error;
    };
  } finally {
    assert.throws(f, regExp);
  }
}

async function run(config, expected) {
  // tests here
  let result = await htmllint(config);
  // copy only the properties we want to test
  // url property is absolute, system-dependend path
  result = result.map(msg => {
    return {
      file: msg.file,
      type: msg.type,
      message: msg.message,
      lastLine: msg.lastLine,
      lastColumn: msg.lastColumn
    };
  });
  assert.deepStrictEqual(result, expected);
}

const defaultFiles = ['tests/fixtures/valid.html', 'tests/fixtures/invalid.html'];
const errorlevels = ['info', 'warning', 'error'];

describe('htmllint - success', () => {
  it('Should report 0 errors from tests/fixtures/valid.html', async() => {
    await run({ errorlevels, files: ['tests/fixtures/valid.html'] }, []);
  });
});

describe('htmllint - all', () => {
  it('Should report four errors from tests/fixtures/invalid.html', async() => {
    const expected = expectedResults.invalid;
    await run({ errorlevels, files: defaultFiles }, expected);
  });
  it('Should report eight errors from 2 x tests/fixtures/invalid.html', async() => {
    const expected = [...expectedResults.invalid, ...expectedResults.invalid];
    await run({
      errorlevels,
      files: ['tests/fixtures/invalid.html', 'tests/fixtures/valid.html', 'tests/fixtures/invalid.html'],
      maxCharsPerChunk: 30 // Explicitly set low to divide the 2 src files into 2 chunks.
    }, expected);
  });

  it('Should report four errors from tests/fixtures/invalid.html with absoluteFilePathsForReporter', async() => {
    const expected = expectedResults.invalid.map(result => {
      return {
        file: path.resolve(result.file),
        type: result.type,
        message: result.message,
        lastLine: result.lastLine,
        lastColumn: result.lastColumn
      };
    });
    await run({ errorlevels, files: defaultFiles, absoluteFilePathsForReporter: true }, expected);
  });
});

describe('htmllint - empty', () => {
  it('Should report 0 errors from 0 files', async() => {
    await run({
      files: [],
      errorlevels: ['info', 'warning', 'error']
    }, []);
  });
});

describe('htmllint - ignore', () => {
  it('Should report one error from test/fixtures/invalid.html, three were ignored', async() => {
    const expected = [{
      file: path.normalize('tests/fixtures/invalid.html'),
      type: 'error',
      message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
      lastLine: 10,
      lastColumn: 96
    }];
    await run({ errorlevels, files: defaultFiles,
      ignore: [
        '',
        'The "clear" attribute on the "br" element is obsolete. Use CSS instead.',
        'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
        /attribute “[a-z]+” not allowed/i
      ]
    }, expected);
  });
});

describe('htmllint - bad-encoding', () => {
  it('Should report 4 errors from tests/fixtures/invalid-encoding.html', async() => {
    const expected = [
      {
        file: path.normalize('tests/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Malformed byte sequence: “e1”.',
        lastLine: 5,
        lastColumn: 9
      },
      {
        file: path.normalize('tests/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Malformed byte sequence: “e1”.',
        lastLine: 9,
        lastColumn: 18
      },
      {
        file: path.normalize('tests/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Internal encoding declaration “iso-8859-1” disagrees with the actual encoding of the document (“utf-8”).',
        lastLine: 4,
        lastColumn: 74
      },
      {
        file: path.normalize('tests/fixtures/invalid-encoding.html'),
        type: 'error',
        message: 'Bad value “text/html; charset=iso-8859-1” for attribute “content” on element “meta”: “charset=” must be followed by “utf-8”.',
        lastLine: 4,
        lastColumn: 74
      }
    ];
    await run({
      files: [path.normalize('tests/fixtures/invalid-encoding.html')],
      errorlevels
    }, expected);
  });
});

describe('htmllint - no-lang', () => {
  it('Should report 1 warning from tests/fixtures/no-lang.html', async() => {
    const expected = [
      {
        file: path.normalize('tests/fixtures/no-lang.html'),
        lastColumn: 6,
        lastLine: 2,
        message: 'Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.',
        type: 'info'
      }
    ];
    await run({
      files: ['tests/fixtures/no-lang.html'],
      errorlevels
    }, expected);
  });
  it('Should report 0 errors from tests/fixtures/no-lang.html', async() => {
    await run({
      files: ['tests/fixtures/no-lang.html'],
      noLangDetect: true,
      errorlevels
    }, []);
  });
});

describe('htmllint - invalidPhp', () => {
  it('Should report 4 errors from tests/fixtures/invalid.php', async() => {
    const expected = expectedResults.invalidPhp;
    await run({
      files: ['tests/fixtures/invalid.php'],
      errorlevels,
      ignore: /XML processing instructions/
    }, expected);
  });
});

xdescribe('htmllint - command line failure', () => {
  it('Should fail if command fails', async() => {
    await assertThrowsAsync(run({ files: ['file with space"'], errorlevels }), /Unterminated quoted string/i);
  });
});

describe('htmllint - vnu-server', () => {
  it('Should report four errors from tests/fixtures/invalid.html', async() => {
    const expected = expectedResults.invalid;
    const options = {
      files: defaultFiles,
      server: {
        host: '127.0.0.1',
        port: 8877,
        charset: 'UTF-8'
      },
      ignore: [
        'Overriding document character encoding from none to “UTF-8”.'
      ],
      errorlevels
    };
    await run(options, expected);
  });
  it('Should report eight errors from 2 x tests/fixtures/invalid.html', async() => {
    const expected = [...expectedResults.invalid, ...expectedResults.invalid];
    const options = {
      files: ['tests/fixtures/invalid.html', 'tests/fixtures/valid.html', 'tests/fixtures/invalid.html'],
      server: {
        port: 8877,
        charset: 'UTF-8'
      },
      maxCharsPerChunk: 30, // Explicitly set low to divide the 2 src files into 2 chunks.
      ignore: [
        'Overriding document character encoding from none to “UTF-8”.'
      ],
      errorlevels
    };
    await run(options, expected);
  });
  it('Should fail if no port is provided', async() => {
    const options = {
      files: defaultFiles,
      server: {
        host: '127.0.0.1'
      },
      errorlevels
    };
    await assertThrowsAsync(run(options), /Expected to find validator service/);
  });
  it('Should fail for not finding vnu server on the given port', async() => {
    const options = {
      files: defaultFiles,
      server: {
        port: 8876 // Explicitly specify wrong port to check failure. vnu-server is serving on port 8877.
      },
      errorlevels
    };
    await assertThrowsAsync(run(options), /Expected to find validator service/);
  });
});
