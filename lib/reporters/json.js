/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 */

function json(results) {
  results.forEach((result) => {
    // result already has 'file' property, 'url' is redundant
    delete result.url;
  });

  return JSON.stringify(results);
}

module.exports = json;
