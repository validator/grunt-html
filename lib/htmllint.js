module.exports = function(config, done) {
  var path = require('path');
  var exec = require('child_process').exec;
  var jar = __dirname + '/../vnu.jar';
  exec('java -jar ' + jar + ' --format json ' + config.files.join(' '), function(error, stdout, stderr) {
    if (error) {
      done(error);
      return;
    }
    var result = [];
    if (stderr) {
      result = JSON.parse(stderr).messages;
      result.forEach(function(message) {
        message.file = path.relative('.', message.url.replace('file:', ''));
      });
    }
    done(null, result);
  });
};