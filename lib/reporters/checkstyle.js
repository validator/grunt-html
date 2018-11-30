/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 *
 * Modified from the original by: Boy Baukema
 * https://github.com/relaxnow
 */

'use strict';

const path = require('path');
const util = require('./util');

function checkstyle(results) {
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

  out.push('<?xml version="1.0" encoding="utf-8"?><checkstyle>');

  for (const fileName in files) {
    if (Object.prototype.hasOwnProperty.call(files, fileName)) {
      out.push(`\t<file name="${fileName}">`);
      for (let i = 0, len = files[fileName].length; i < len; i++) {
        const issue = files[fileName][i];

        out.push(
          `\t\t<error line="${issue.line}" column="${issue.column}" severity="${issue.severity}" message="${util.encode(issue.message)}" source="${issue.source}" />`
        );
      }
      out.push('\t</file>');
    }
  }

  out.push('</checkstyle>');

  return out.join('\n');
}

module.exports = checkstyle;
