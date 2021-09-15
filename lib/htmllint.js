'use strict';

const path = require('path');
const { execFile } = require('child_process');
const async = require('async');
const jar = require('vnu-jar');
const chunkify = require('./chunkify.js');
const javadetect = require('./javadetect.js');

// chunkify's max characters
const MAX_CHARS = 5000;

// Increase child process buffer to accommodate large amounts of
// validation output. (the default is a paltry 200k)
// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
const MAX_BUFFER = 20_000 * 1024;

// Replace left/right quotation marks with normal quotation marks
function normalizeQuotationMarks(string) {
  if (string) {
    string = string.replace(/[\u201C\u201D]/g, '"');
  }

  return string;
}

// Parse and, if needed, normalize error messages from HttpClient to java -jar format
// java -jar: one object containing messages for all files
//   { messages: [{ message, type, url, ... }, ...] }
// HttpClient: one object per file, separated by a newline,
// each object containing messages for only that file
//   { messages: [{ message, type, ...}, ...], url }\n{ ... }
function parseErrorMessages(errors, config) {
  const parsed = JSON.parse(config.server ? `[${errors.trim().replace(/\n/g, ',')}]` : errors);
  let { messages } = parsed;

  if (config.server) {
    // Extract "messages" property from each object and set the url of each message.
    // This results in an array of arrays instead of array of objects, which is then
    // flattened by concatenation
    // eslint-disable-next-line unicorn/prefer-spread
    messages = [].concat(...messages, parsed.map(file => {
      return file.messages.map(message => {
        message.url = file.url;
        return message;
      });
    }));
  }

  return messages;
}

// Determine proper jarfile arguments
function javaArgs(java, chunk, config) {
  const args = [];

  // Increase the default stack size for ia32 versions
  if (java.arch === 'ia32') {
    args.push('-Xss512k');
  }

  args.push(config.server ? '-cp' : '-jar', `"${jar}"`);

  if (config.server) {
    if (config.server.host) {
      args.push(`-Dnu.validator.client.host=${config.server.host}`);
    }

    if (config.server.port) {
      args.push(`-Dnu.validator.client.port=${config.server.port}`);
    }

    args.push('-Dnu.validator.client.out=json nu.validator.client.HttpClient');
  } else {
    args.push('--format', 'json');
  }

  if (config.noLangDetect) {
    args.push('--no-langdetect');
  }

  return [...args, chunk];
}

function htmllint(config, done) {
  if (config.files.length === 0) {
    return done(null, []);
  }

  javadetect((err, java) => {
    if (err) {
      throw err;
    }

    const [majorVersion, minorVersion] = java.version.split('.').map(part => Number(part));

    if ((majorVersion !== 1 && majorVersion < 8) || (majorVersion === 1 && minorVersion < 8)) {
      throw new Error(`\nUnsupported Java version used: ${java.version}. Java 8 environment or up is required!`);
    }

    const files = config.files.map(file => path.normalize(file));
    const chunks = chunkify(files, MAX_CHARS);

    async.mapSeries(chunks, (chunk, cb) => {
      const args = javaArgs(java, chunk, config);

      execFile('java', args, { maxBuffer: MAX_BUFFER, shell: true }, (error, stdout, stderr) => {
        if (error && (error.code !== 1 || error.killed || error.signal)) {
          cb(error);
          return;
        }

        stderr = config.server ? stdout : stderr;
        let result = [];

        if (stderr) {
          try {
            result = parseErrorMessages(stderr, config);
          } catch (error_) {
            throw new Error(`${error_}\nInvalid input follows below:\n\n${stderr}`);
          }

          for (const message of result) {
            if (message.url) {
              message.file = path.relative('.', message.url.replace(path.sep === '\\' ? 'file:/' : 'file:', ''));
            }

            if (config.absoluteFilePathsForReporter) {
              message.file = path.resolve(message.file);
            }
          }

          if (config.ignore) {
            const ignore = Array.isArray(config.ignore) ? config.ignore : [config.ignore];

            result = result.filter(message => {
              // Iterate over the ignore rules and test the message against each rule.
              // A match should return false, which causes every() to return false and
              // the message to be filtered out.
              return ignore.every(currentValue => {
                if (currentValue instanceof RegExp) {
                  return !currentValue.test(message.message);
                }

                return normalizeQuotationMarks(currentValue) !== normalizeQuotationMarks(message.message);
              });
            });
          }
        }

        cb(null, result);
      });
    }, (error, results) => {
      if (error) {
        done(error);
        return;
      }

      const result = results.flatMap(message => [...message])
        .filter(message => config.errorlevels.includes(message.type));

      done(null, result);
    });
  });
}

module.exports = htmllint;
