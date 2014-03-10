var chunkify = require('../lib/chunkify');

exports.chunkify = {
  'default': function(test) {
      var files = ['./some/long/path/to/file.html','./some/long/path/to/file.html', './some/long/path/to/file.html'],
        chunked = ['./some/long/path/to/file.html ./some/long/path/to/file.html ', './some/long/path/to/file.html '],
        all = ['./some/long/path/to/file.html ./some/long/path/to/file.html ./some/long/path/to/file.html '];
      test.deepEqual(chunkify(files, 60), chunked, "Should split the file list of file in 2 chunks");
      test.deepEqual(chunkify(files, 120), all, "Should do a single chunk");
      test.done();
  }
};
