'use strict';

module.exports = function (grunt, options, wrapData) {
  var wrapTpl = grunt.file.read(wrapData.partialPath);
  var files = options.files;
  var content;
  var path;
  wrapTpl = wrapTpl.split('<!-- CONTENT -->');
  wrapData.cache = {};
  wrapData.files = [];
  wrapData.lineOffset = wrapTpl[0].split(/\n/).length - 1;
  for (var i = 0; i < files.length; i += 1) {
    path = wrapData.tmpOutputDir + '/' + files[i].replace(/^(\.\.\/)+/, '');
    content = wrapTpl[0] + grunt.file.read(files[i]) + wrapTpl[1];
    grunt.file.write(path, content);
    wrapData.cache[path] = files[i];
    wrapData.files.push(path);
  }
  options.wrapData = wrapData;
  options.files = wrapData.files;
};
