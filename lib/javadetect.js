'use strict';

const { exec } = require('child_process');

function javadetect(callback) {
  exec('java -version', (error, stdout, stderr) => {
    if (error) {
      return callback(error);
    }

    callback(null, {
      version: stderr.match(/(?:java|openjdk) version "(.*)"/)[1],
      arch: stderr.match(/64-Bit/) ? 'x64' : 'ia32'
    });
  });
}

module.exports = javadetect;
