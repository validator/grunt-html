'use strict';

const assert = require('assert').strict;
const os = require('os');
const getThreads = require('../lib/getThreads.js');

// eslint-disable-next-line unicorn/explicit-length-check
const CPUS = os.cpus() && os.cpus().length;
const THREADS = CPUS > 2 ? CPUS - 1 : 1;

describe('getThreads', () => {
  it('should use the number of available threads -1', done => {
    const config = {};

    for (const option of ['auto', true, -1, '', null, undefined]) {
      config.threads = option;
      const expected = THREADS;
      const actual = getThreads(config);

      assert.equal(actual, expected, `"thread: ${option}" failed!`);
    }

    done();
  });

  it('should return 1 with `threads: false`', done => {
    const config = {
      threads: false
    };
    const expected = 1;
    const actual = getThreads(config);

    assert.equal(actual, expected);
    done();
  });

  it('should return the number of threads', done => {
    const config = {
      threads: 4
    };
    const expected = 4;
    const actual = getThreads(config);

    assert.equal(actual, expected);
    done();
  });

  it('should throw an error with invalid threads option', done => {
    const config = {};

    for (const option of [-2, 'foo']) {
      config.threads = option;
      const expected = () => getThreads(config);
      assert.throws(expected, /^Error: Invalid threads/, `"thread: ${option}" failed!`);
    }

    done();
  });
});
