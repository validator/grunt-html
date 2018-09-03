function chunkify(files, maxChars) {
  const filesChunk = [];
  let chunk = '';

  for (let f = 0, len = files.length; f < len; f++) {
    if (chunk.length + (files[f].length + 1) > maxChars) {
      filesChunk.push(chunk);
      chunk = '';
    }
    chunk += `"${files[f]}" `;
  }
  filesChunk.push(chunk);

  return filesChunk;
}

module.exports = chunkify;
