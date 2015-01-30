module.exports = function(config, done) {
  var path = require('path');
  var exec = require('child_process').exec;
  var chunkify = require('./chunkify');
  var async = require('async');
  var javadetect = require('./javadetect');
  var jar = __dirname + '/../vnu.jar';

  var maxChars = 5000;

  // increase child process buffer to accommodate large amounts of
  // validation output. (default is a paltry 200k.)
  // http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  var maxBuffer = 20000 * 1024;

  var files = config.files.join(' ');
  var chunks = [];

  // replace left/right quotation marks with normal quotation marks
  function normalizeQuotationMarks(str) {
    if (str) {
      str = str.replace(/[\u201c\u201d]/g, '"');
    }
    return str;
  }

  javadetect(function(error, java){
    if (error) {
      throw error;
    }

    async.mapSeries(chunkify(config.files, maxChars), function(chunk, cb) {

      // call java, increasing the default stack size for ia32 versions of the JRE and using the default setting for x64 versions
      var cmd = 'java ' + (java.arch === 'ia32' ? '-Xss512k ' : '') + '-jar "' + jar + '" --format json ' + chunk;
      exec(cmd, {
        'maxBuffer' : maxBuffer
      }, function(error, stdout, stderr) {
         if (error && (error.code !== 1 || error.killed || error.signal)) {
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
              // iterate over the ignore rules and test the message agains each rule.
              // A match should return false, which causes every() to return false and the message to be filtered out.
              return config.ignore.every(function (currentValue) {
                if (currentValue instanceof RegExp) {
                  return !currentValue.test(message.message);
                } else {
                  return normalizeQuotationMarks(currentValue) !== normalizeQuotationMarks(message.message);
                }
              });
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
  });
};
