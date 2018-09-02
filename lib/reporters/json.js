/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 */

module.exports = function(results) {
  results.forEach((result) => {
    // result already has 'file' property, 'url' is redundant
    delete result.url;
  });

  return JSON.stringify(results);
};
