'use strict';

const path = require('path');
const chalk = require('chalk');

// Default Grunt reporter
function defaultReporter(result) {
  const out = result.map(message => {
    let output = `${chalk.cyan(message.file)} `;

    output += chalk.red('[') + chalk.yellow(`L${message.lastLine}`) +
      chalk.red(':') + chalk.yellow(`C${message.lastColumn}`) + chalk.red('] ');
    output += message.message;
    return output;
  });

  return out.join('\n');
}

// Select a reporter (if not using the default Grunt reporter)
function selectReporter(options) {
  switch (options.reporter) {
    case 'checkstyle': {
    // Checkstyle XML reporter
      options.reporter = '../lib/reporters/checkstyle.js';
      break;
    }

    case 'json': {
    // JSON reporter
      options.reporter = '../lib/reporters/json.js';
      break;
    }

    case 'junit': {
    // JUnit reporter
      options.reporter = '../lib/reporters/junit.js';
      break;
    }

    default: {
      if (options.reporter !== null && typeof options.reporter !== 'undefined') {
        // Custom reporter
        options.reporter = path.resolve(process.cwd(), options.reporter);
      }
    }
  }

  return options.reporter ? require(options.reporter) : defaultReporter;
}

module.exports = {
  defaultReporter,
  selectReporter
};
