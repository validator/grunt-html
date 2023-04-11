'use strict';

const path = require('node:path');
const process = require('node:process');
const picocolors = require('picocolors');

// Default Grunt reporter
function defaultReporter(result) {
  const out = result.map(message => {
    return `${picocolors.cyan(message.file)} ` +
      picocolors.red('[') + picocolors.yellow(`L${message.lastLine}`) +
      picocolors.red(':') + picocolors.yellow(`C${message.lastColumn}`) + picocolors.red('] ') +
      message.message;
  });

  return out.join('\n');
}

// Select a reporter (if not using the default Grunt reporter)
function selectReporter(options) {
  let { reporter } = options;

  switch (reporter) {
    case 'checkstyle': {
      reporter = './reporters/checkstyle.js';
      break;
    }

    case 'json': {
      reporter = './reporters/json.js';
      break;
    }

    case 'junit': {
      reporter = './reporters/junit.js';
      break;
    }

    default: {
      // Custom reporter if specified
      if (reporter !== null && reporter !== undefined) {
        reporter = path.resolve(process.cwd(), reporter);
      }
    }
  }

  return reporter ? require(reporter) : defaultReporter;
}

module.exports = {
  defaultReporter,
  selectReporter
};
