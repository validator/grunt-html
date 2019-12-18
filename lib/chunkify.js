'use strict';

function chunkify(files, maxBuffer) {
  const fs = require('fs');
  const filesChunk = [];
  let chunk = '';
  let chunkLen = 0;

  for (let f = 0, len = files.length; f < len; f++) {
    const stats = fs.statSync(files[f]);
    if (chunkLen + (stats.size + 1) > maxBuffer) {
      filesChunk.push(chunk.trim());
      chunk = '';
      chunkLen = 0;
    }

    chunkLen += stats.size;
    chunk += `"${files[f]}" `;
  }

  filesChunk.push(chunk.trim());

  return filesChunk;
}

module.exports = chunkify;
