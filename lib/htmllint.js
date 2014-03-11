module.exports = function(config, done) {
  var path = require('path');
  var exec = require('child_process').exec;
  var chunkify = require('./chunkify');
  var async = require('async');
  var jar = __dirname + '/../vnu.jar';

  var maxChars = 5000;

  var files = config.files.join(' ');
  var chunks = [];

  async.mapSeries(chunkify(config.files, maxChars), function(chunk, cb) {
    exec('java -jar ' + jar + ' --format json ' + chunk, function(error, stdout, stderr) {
       if (error) {
        cb(error);
        return;
      }

      var result = [];
      if (stderr) {
        result = JSON.parse(stderr).messages;
        result.forEach(function(message) {
          message.file = path.relative('.', message.url.replace(path.sep !== '\\' ? 'file:' : 'file:/', ''));
        });
        if (config.ignore) {
          result = result.filter(function(message) {
            return config.ignore.indexOf(message.message) === -1;
          });
        }
      }
      cb(null, result);
    });
  }, function (error, results) {
    if (error) {
      done(error);
      return;
    }

    var result = [];
    for (var r = 0; r < results.length; r++) {
      result = result.concat(results[r]);
    }
    done(null, result);
  });
};