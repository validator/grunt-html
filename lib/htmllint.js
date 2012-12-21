module.exports = function(grunt, files, done) {
  var jar = __dirname + '/../vnu.jar';
  grunt.util.spawn({
    cmd: 'java',
    args: ['-Dnu.validator.client.quiet=yes',  '-jar', jar].concat(files)
  }, function(error, output) {
    if (error) {
      done(error);
      return;
    }
    var result = [];
    if (output.stdout) {
      result = output.stdout.split('\n');
    }
    done(null, result);
  });
};