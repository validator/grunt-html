'use strict';

const assert = require('assert');
const chunkify = require('../lib/chunkify');
describe('chunkify', () => {
  const files = ['./some/long/path/to/1/file.html', './some/long/path/to/2/file.html', './some/long/path/to/3/file.html'];
  const chunked = ['"./some/long/path/to/1/file.html" "./some/long/path/to/2/file.html"', '"./some/long/path/to/3/file.html"'];
  const all = ['"./some/long/path/to/1/file.html" "./some/long/path/to/2/file.html" "./some/long/path/to/3/file.html"'];
  it('Should split the file list in 2 chunks', () => {
    assert.deepStrictEqual(chunkify(files, 70), chunked);
  });
  it('Should do a single chunk', () => {
    assert.deepStrictEqual(chunkify(files, 120), all);
  });
});
