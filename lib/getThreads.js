'use strict';

const os = require('os');

// eslint-disable-next-line unicorn/explicit-length-check
const CPUS = os.cpus() && os.cpus().length;
const THREADS = CPUS > 2 ? CPUS - 1 : 1;

function getThreads(config) {
  const { threads } = config;

  const defaultCheck = threads === 'auto' ||
    threads === -1 ||
    threads === '' ||
    threads === true ||
    threads === null ||
    typeof threads === 'undefined';

  if (defaultCheck) {
    return THREADS;
  }

  if (threads === 0 || threads === 1 || threads === false) {
    return 1;
  }

  if (threads > 1) {
    return threads;
  }

  throw new Error(`Invalid threads option! (${threads})`);
}

module.exports = getThreads;
