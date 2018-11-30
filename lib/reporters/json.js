/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 */

'use strict';

function json(results) {
  results.forEach(result => {
    // result already has 'file' property, 'url' is redundant
    delete result.url;
  });

  return JSON.stringify(results);
}

module.exports = json;
