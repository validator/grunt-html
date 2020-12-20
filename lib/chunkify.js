'use strict';

function chunkify(files, maxChars) {
  const filesChunk = [];
  let chunk = '';

  for (const file of files) {
    if (chunk.length + (file.length + 1) > maxChars) {
      filesChunk.push(chunk.trim());
      chunk = '';
    }

    chunk += `"${file}" `;
  }

  filesChunk.push(chunk.trim());

  return filesChunk;
}

module.exports = chunkify;
