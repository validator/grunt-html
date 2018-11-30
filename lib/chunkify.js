'use strict';

function chunkify(files, maxChars) {
  const filesChunk = [];
  let chunk = '';

  for (let f = 0, len = files.length; f < len; f++) {
    if (chunk.length + (files[f].length + 1) > maxChars) {
      filesChunk.push(chunk.trim());
      chunk = '';
    }
    chunk += `"${files[f]}" `;
  }

  filesChunk.push(chunk.trim());

  return filesChunk;
}

module.exports = chunkify;
