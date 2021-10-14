'use strict';

/**
 * Parse and, if needed, normalize error messages from HttpClient to java -jar format
 * java -jar: one object containing messages for all files
 *   { messages: [{ message, type, url, ... }, ...] }
 * HttpClient: one object per file, separated by a newline,
 * each object containing messages for only that file
 *   { messages: [{ message, type, ...}, ...], url }\n{ ... }
 */
function parseErrorMessages(errors, config) {
  const normalizedErrors = config.server ? `[${errors.trim().replace(/\n/g, ',')}]` : errors;
  const parsedErrors = JSON.parse(normalizedErrors);

  // If server is not used, return the messages as is
  if (!config.server) {
    return parsedErrors.messages;
  }

  // Extract the "messages" property from each object and set the url of each message.
  // This results in an array of arrays instead of array of objects, which is then flattened.
  return parsedErrors.flatMap(file => {
    return file.messages.map(message => {
      message.url = file.url;
      return message;
    });
  });
}

module.exports = parseErrorMessages;
