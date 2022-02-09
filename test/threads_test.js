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

    for (const option of ['auto', -1, '', true, null, undefined]) {
      config.threads = option;
      const expected = THREADS;
      const actual = getThreads(config);

      assert.equal(actual, expected, `"thread: ${option}" failed!`);
    }

    done();
  });

  it('should return 1 with false, 0, or 1', done => {
    const config = {};

    for (const option of [0, 1, false]) {
      config.threads = option;
      const expected = 1;
      const actual = getThreads(config);
      assert.equal(actual, expected);
    }

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
});
