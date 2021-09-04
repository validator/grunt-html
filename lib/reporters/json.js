/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 */

'use strict';

function json(results) {
  for (const result of results) {
    // result already has 'file' property, 'url' is redundant
    delete result.url;
  }

  return JSON.stringify(results, null, 2);
}

module.exports = json;
