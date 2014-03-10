module.exports = function(config, done) {
  var path = require('path');
  var exec = require('child_process').exec;
  var async = require('async');
  var jar = __dirname + '/../vnu.jar';

  var max_limit = 5000;

  var files = config.files.join(' ');

  var process = function(input) {
    var result = [];
    result = JSON.parse(input).messages;
    result.forEach(function(message) {
      message.file = path.relative('.', message.url.replace('file:', ''));
    });
    if (config.ignore) {
      result = result.filter(function(message) {
        return config.ignore.indexOf(message.message) === -1;
      });
    }

    return result;
  };

  var chunkify = function () {
    // Use a safe path delimiter for creating chunks
    var fileList = config.files.join(path.delimiter);
    var filesChunk = [];
    var chunks = Math.ceil(fileList.length / max_limit);
    var lastPos = 0;
    var pos, chunk;

    for (var c=1; c <= chunks; c++) {
      chunk = fileList.substring(lastPos, lastPos + max_limit);
      pos = c < chunks ? chunk.lastIndexOf(path.delimiter) : fileList.length;
      filesChunk.push(chunk.substring(0, pos).replace(new RegExp(path.delimiter, "g"), " "));
      lastPos = lastPos + pos + 1;
    }

    return filesChunk;
  };

  if ( files.length < max_limit) {
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
    async.mapSeries(chunkify(), function(chunk, cb) {
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