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
  if (options.reporter === 'checkstyle') {
    // Checkstyle XML reporter
    options.reporter = '../lib/reporters/checkstyle.js';
  } else if (options.reporter === 'json') {
    // JSON reporter
    options.reporter = '../lib/reporters/json.js';
  } else if (options.reporter === 'junit') {
    // JUnit reporter
    options.reporter = '../lib/reporters/junit.js';
  } else if (options.reporter !== null && typeof options.reporter !== 'undefined') {
    // Custom reporter
    options.reporter = path.resolve(process.cwd(), options.reporter);
  }

  let reporter;

  if (options.reporter) {
    reporter = require(options.reporter); // eslint-disable-line global-require
  } else {
    reporter = defaultReporter;
  }

  return reporter;
}

module.exports = {
  defaultReporter,
  selectReporter
};
