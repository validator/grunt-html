/*
 * Author: Josh Hagins
 * https://github.com/jawshooah
 */

module.exports  = {
  reporter: function(results) {
    results.forEach(function(result) {
      // result already has 'file' property, 'url' is redundant
      delete result.url;
    });
    console.log(JSON.stringify(results));
  }
};
