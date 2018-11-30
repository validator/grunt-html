/*
 * Author: Iestyn Polley
 * https://github.com/iestyn
 */

'use strict';

const path = require('path');
const util = require('./util');

function junit(results) {
  const files = {};
  const out = [];

  results.forEach(result => {
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
  });

  out.push(`<?xml version="1.0" encoding="utf-8"?>\n<testsuite name="htmllint" tests="${Object.keys(files).length}" failures="0" errors="${results.length}">`);

  for (const fileName in files) {
    if (Object.prototype.hasOwnProperty.call(files, fileName)) {
      out.push(`<testcase name="${fileName}">\n<error message="${files[fileName].length} Errors">`);
      for (let i = 0, len = files[fileName].length; i < len; i++) {
        const issue = files[fileName][i];

        out.push(
          `${i + 1} line ${issue.line}, char ${issue.column}: ${util.encode(issue.message)}`
        );
      }
      out.push('</error>\n</testcase>');
    }
  }

  out.push('</testsuite>');

  return out.join('\n');
}

module.exports = junit;
