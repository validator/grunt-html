module.exports = function(config, done) {
  var path = require('path');
  var exec = require('child_process').exec;
  var os = require('os');
  var chunkify = require('./chunkify');
  var async = require('async');
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

  async.mapSeries(chunkify(config.files, maxChars), function(chunk, cb) {

    // call java, increasing the default stack size for ia32 systems and using the default setting for x64 systems
    exec('java ' + (os.arch() === 'ia32' ? '-Xss512k ' : '') + '-jar "' + jar + '" --format json ' + chunk, {
      'maxBuffer' : maxBuffer
    }, function(error, stdout, stderr) {
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
            for (var i = 0; i < config.ignore.length; i++) {
              // if the ignore rule is a regexp, see if we get a match of the regexp in the current message
              if (config.ignore[i] instanceof RegExp) {
                if (config.ignore[i].test(message.message)) {
                  return false;
                }
              } else {
                // if a string in the ignore array matches the message except possible differences in quotation marks we consider it a match
                // (this is to avoid confusion since left/right quotation marks, which is what vnu.jar uses in message,
                // can be displayed as normal quotation marks in the console on Windows).
                if (normalizeQuotationMarks(config.ignore[i]) === normalizeQuotationMarks(message.message)) {
                  return false;
                }
              }
            }

            return true;
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
