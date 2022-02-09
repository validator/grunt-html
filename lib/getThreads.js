'use strict';

const os = require('os');

// eslint-disable-next-line unicorn/explicit-length-check
const CPUS = os.cpus() && os.cpus().length;
const THREADS = CPUS > 2 ? CPUS - 1 : 1;

function getThreads(config) {
  const { threads } = config;

  switch (threads) {
    case 'auto':
    case -1:
    case '':
    case true:
    case null:
    case undefined:
      return THREADS;
    case 0:
    case 1:
    case false:
      return 1;
    default:
      if (threads > 1) {
        return threads;
      }
  }
}

module.exports = getThreads;
