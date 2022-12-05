/*
 * Author: Iestyn Polley
 * https://github.com/iestyn
 */

'use strict';

const path = require('node:path');
const { encode } = require('../util.js');

function junit(results) {
  const files = {};
  const out = [];

  for (const result of results) {
    // Register the file
    result.file = path.normalize(result.file);
    if (!files[result.file]) {
      files[result.file] = [];
    }

    // Add the error
    files[result.file].push({
      severity: result.type,
      line: result.lastLine,
      column: result.lastColumn,
      message: result.message,
      source: `htmllint.Validation${result.type === 'error' ? 'Error' : 'Warning'}`
    });
  }

  const filesArray = Object.entries(files);

  out.push(`<?xml version="1.0" encoding="utf-8"?>\n<testsuite name="htmllint" tests="${filesArray.length}" failures="0" errors="${results.length}">`);

  for (const [file, errors] of filesArray) {
    out.push(`<testcase name="${file}">\n<error message="${errors.length} Errors">`);

    for (const [i, error] of errors.entries()) {
      out.push(`${i + 1} line ${error.line}, char ${error.column}: ${encode(error.message)}`);
    }

    out.push('</error>\n</testcase>');
  }

  out.push('</testsuite>');

  return out.join('\n');
}

module.exports = junit;
