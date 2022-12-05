'use strict';

const path = require('node:path');
const { execFile } = require('node:child_process');
const async = require('async');
const chunkify = require('./chunkify.js');
const getThreads = require('./getThreads.js');
const javaArgs = require('./javaArgs.js');
const javaDetect = require('./javaDetect.js');
const parseErrorMessages = require('./parseErrorMessages.js');
const processErrorMessages = require('./processErrorMessages.js');

// chunkify's max characters
const MAX_CHARS = 5000;

/**
 * Increase child process buffer to accommodate large amounts of validation output.
 * The default is a paltry 200k:
 * https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 */
const MAX_BUFFER = 20_000 * 1024;

function htmllint(config, done) {
  if (config.files.length === 0) {
    return done(null, []);
  }

  javaDetect((err, java) => {
    if (err) {
      throw err;
    }

    const [majorVersion, minorVersion] = java.version.split('.').map(Number);

    if ((majorVersion !== 1 && majorVersion < 8) || (majorVersion === 1 && minorVersion < 8)) {
      throw new Error(`\nUnsupported Java version used: ${java.version}. Java 8 environment or up is required!`);
    }

    const files = config.files.map(file => path.normalize(file));
    const chunks = chunkify(files, MAX_CHARS);
    const threads = getThreads(config);

    async.mapLimit(chunks, threads, (chunk, cb) => {
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

          result = processErrorMessages(result, config);
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
