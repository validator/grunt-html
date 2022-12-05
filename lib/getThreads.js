'use strict';

const os = require('node:os');

const THREADS = Math.max(os.cpus().length - 1, 1);

function getThreads({ threads }) {
  switch (threads) {
    case 'auto':
    case -1:
    case '':
    case true:
    case null:
    case undefined: {
      return THREADS;
    }

    case 0:
    case 1:
    case false: {
      return 1;
    }

    default: {
      if (threads > 1) {
        return threads;
      }
    }
  }
}

module.exports = getThreads;
