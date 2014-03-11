module.exports = function (fileList, maxChars) {
  var path = require('path');

  // Use a safe path delimiter for creating chunks
  var files = fileList.join(path.delimiter);

  if ( files.length > maxChars) {
    var filesChunk = [];
    var chunks = Math.ceil(files.length / maxChars);
    var lastPos = 0;
    var pos, chunk;

    for (var c=1; c <= chunks; c++) {
      chunk = files.substring(lastPos, lastPos + maxChars);
      pos = c < chunks ? chunk.lastIndexOf(path.delimiter) : files.length;
      filesChunk.push(chunk.substring(0, pos).replace(new RegExp(path.delimiter, "g"), " "));
      lastPos = lastPos + pos + 1;
    }

    return filesChunk;
  } 

  return [fileList.join(' ')];
};