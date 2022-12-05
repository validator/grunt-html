'use strict';

const path = require('node:path');
const { normalizeQuotationMarks } = require('./util.js');

const processedMessages = (errors, config) => {
  return errors.map(message => {
    if (message.url) {
      message.file = path.relative('.', message.url.replace(path.sep === '\\' ? 'file:/' : 'file:', ''));
    }

    if (config.absoluteFilePathsForReporter) {
      message.file = path.resolve(message.file);
    }

    return message;
  });
};

function processErrorMessages(errors, config) {
  const messages = processedMessages(errors, config);

  if (!config.ignore) {
    return messages;
  }

  const ignore = Array.isArray(config.ignore) ? config.ignore : [config.ignore];

  // Iterate over the ignore rules and test the message against each rule.
  // A match should return false, which causes every() to return false and
  // the message to be filtered out.
  return messages.filter(({ message }) => {
    return ignore.every(
      currentValue => currentValue instanceof RegExp ?
        !currentValue.test(message) :
        normalizeQuotationMarks(currentValue) !== normalizeQuotationMarks(message)
    );
  });
}

module.exports = processErrorMessages;
