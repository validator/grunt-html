/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 *
 * Modified from the original by: Boy Baukema
 * https://github.com/relaxnow
 */

'use strict';

const path = require('node:path');
const { encode } = require('../util.js');

function checkstyle(results) {
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

  out.push('<?xml version="1.0" encoding="utf-8"?><checkstyle>');

  for (const [file, errors] of Object.entries(files)) {
    out.push(`\t<file name="${file}">`);

    for (const error of errors) {
      out.push(`\t\t<error line="${error.line}" column="${error.column}" severity="${error.severity}" message="${encode(error.message)}" source="${error.source}" />`);
    }

    out.push('\t</file>');
  }

  out.push('</checkstyle>');

  return out.join('\n');
}

module.exports = checkstyle;
