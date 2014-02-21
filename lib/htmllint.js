module.exports = function(grunt, files, done) {
  var path = require('path');
  var jar = __dirname + '/../vnu.jar';
  grunt.util.spawn({
    cmd: 'java',
    args: ['-jar', jar, '--format', 'json'].concat(files)
  }, function(error, output) {
    if (error) {
      done(error);
      return;
    }
    var result = [];
    if (output.stderr) {
      result = JSON.parse(output.stderr).messages;
      result.forEach(function(message) {
        message.file = path.relative('.', message.url.replace('file:', ''));
      });
    }
    done(null, result);
  });
};