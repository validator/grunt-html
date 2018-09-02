const chunkify = require('../lib/chunkify');

exports.chunkify = {
  'default': (test) => {
    const files = ['./some/long/path/to/file.html', './some/long/path/to/file.html', './some/long/path/to/file.html'];
    const chunked = ['"./some/long/path/to/file.html" "./some/long/path/to/file.html" ', '"./some/long/path/to/file.html" '];
    const all = ['"./some/long/path/to/file.html" "./some/long/path/to/file.html" "./some/long/path/to/file.html" '];

    test.deepEqual(chunkify(files, 64), chunked, 'Should split the file list of file in 2 chunks');
    test.deepEqual(chunkify(files, 128), all, 'Should do a single chunk');
    test.done();
  }
};
