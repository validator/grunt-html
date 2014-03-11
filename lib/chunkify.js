module.exports = function (fileList, maxChar) {
  var path = require('path');

  // Use a safe path delimiter for creating chunks
  var files = fileList.join(path.delimiter);
  var filesChunk = [];
  var chunks = Math.ceil(files.length / maxChar);
  var lastPos = 0;
  var pos, chunk;

  for (var c=1; c <= chunks; c++) {
    chunk = files.substring(lastPos, lastPos + maxChar);
    pos = c < chunks ? chunk.lastIndexOf(path.delimiter) : files.length;
    filesChunk.push(chunk.substring(0, pos).replace(new RegExp(path.delimiter, "g"), " "));
    lastPos = lastPos + pos + 1;
  }

  return filesChunk;
};