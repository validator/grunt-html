'use strict';

const { execFile } = require('child_process');

function javadetect(callback) {
  execFile('java', ['-version'], (error, stdout, stderr) => {
    if (error) {
      return callback(error);
    }

    callback(null, {
      version: stderr.match(/(?:java|openjdk) version "(.*)"/)[1],
      arch: /64-Bit/.test(stderr) ? 'x64' : 'ia32'
    });
  });
}

module.exports = javadetect;
