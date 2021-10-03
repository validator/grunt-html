'use strict';

const path = require('path');
const process = require('process');
const chalk = require('chalk');

// Default Grunt reporter
function defaultReporter(result) {
  const out = result.map(message => {
    return `${chalk.cyan(message.file)} ` +
      chalk.red('[') + chalk.yellow(`L${message.lastLine}`) +
      chalk.red(':') + chalk.yellow(`C${message.lastColumn}`) + chalk.red('] ') +
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
      if (reporter !== null && typeof reporter !== 'undefined') {
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
