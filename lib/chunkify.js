'use strict';

function chunkify(files, maxChars) {
  const filesChunk = [];
  let chunk = [];
  let chunkLength = 0;

  for (const file of files) {
    // Account for space between arguments
    const fileLength = file.length + 1;

    if (chunkLength + fileLength > maxChars) {
      filesChunk.push(chunk);
      chunk = [];
      chunkLength = 0;
    }

    chunk.push(file);
    chunkLength += fileLength;
  }

  if (chunk.length > 0) {
    filesChunk.push(chunk);
  }

  return filesChunk;
}

module.exports = chunkify;
