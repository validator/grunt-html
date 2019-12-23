'use strict';

const fs = require('fs');

function chunkify(files, maxChars, maxBuffer) {
  const filesChunk = [];
  let chunk = '';
  let chunkLen = 0;
  let stats;

  for (let f = 0, len = files.length; f < len; f++) {
    stats = undefined;

    if (fs.existsSync(files[f])) {
      stats = fs.statSync(files[f]);
    }

    if (chunk.length + (files[f].length + 1) > maxChars || (stats && (chunkLen + stats.size + 1 > maxBuffer))) {
      filesChunk.push(chunk.trim());
      chunk = '';
      chunkLen = 0;
    }

    if (stats) {
      chunkLen += stats.size;
    }

    chunk += `"${files[f]}" `;
  }

  filesChunk.push(chunk.trim());

  return filesChunk;
}

module.exports = chunkify;
