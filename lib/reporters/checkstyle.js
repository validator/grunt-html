/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 *
 * Modified from the original by: Boy Baukema
 * https://github.com/relaxnow
 */

'use strict';

const path = require('path');
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

  for (const file of Object.keys(files)) {
    out.push(`\t<file name="${file}">`);

    for (const issue of files[file]) {
      out.push(`\t\t<error line="${issue.line}" column="${issue.column}" severity="${issue.severity}" message="${encode(issue.message)}" source="${issue.source}" />`);
    }

    out.push('\t</file>');
  }

  out.push('</checkstyle>');

  return out.join('\n');
}

module.exports = checkstyle;
