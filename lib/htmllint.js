module.exports = function(config, done) {
  var path = require('path');
  var exec = require('child_process').exec;
  var chunkify = require('./chunkify');
  var async = require('async');
  var jar = __dirname + '/../vnu.jar';

  var maxChars = 5000;

  var files = config.files.join(' ');

  var process = function(input) {
    var result = [];
    result = JSON.parse(input).messages;
    result.forEach(function(message) {
      message.file = path.relative('.', message.url.replace(path.sep !== '\\' ? 'file:' : 'file:/', ''));
    });
    if (config.ignore) {
      result = result.filter(function(message) {
        return config.ignore.indexOf(message.message) === -1;
      });
    }

    return result;
  };

  if ( files.length < maxChars) {
    exec('java -jar ' + jar + ' --format json ' + files, function(error, stdout, stderr) {
      if (error) {
        done(error);
        return;
      }

      if (stderr) {
        done(null, process(stderr));
      }
    });
  } else {
    async.mapSeries(chunkify(config.files, maxChars), function(chunk, cb) {
      exec('java -jar ' + jar + ' --format json ' + chunk, function(error, stdout, stderr) {
        if (stderr) {
          cb(error,process(stderr));
        } else {
          cb(error);
        }
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
  }
};