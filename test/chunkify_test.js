'use strict';

const assert = require('assert').strict;
const chunkify = require('../lib/chunkify.js');

describe('chunkify', () => {
  it('should chunkify results', done => {
    const files = [
      './some/long/path/to/1/file.html',
      './some/long/path/to/2/file.html',
      './some/long/path/to/3/file.html'
    ];
    const chunked = [
      '"./some/long/path/to/1/file.html" "./some/long/path/to/2/file.html"',
      '"./some/long/path/to/3/file.html"'
    ];
    const all = ['"./some/long/path/to/1/file.html" "./some/long/path/to/2/file.html" "./some/long/path/to/3/file.html"'];

    assert.deepEqual(chunkify(files, 70), chunked, 'Should split the file list of file in 2 chunks');
    assert.deepEqual(chunkify(files, 120), all, 'Should do a single chunk');
    done();
  });
});
