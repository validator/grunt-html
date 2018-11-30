'use strict';

const path = require('path');
const { exec } = require('child_process');
const async = require('async');
const jar = require('vnu-jar');
const chunkify = require('./chunkify');
const javadetect = require('./javadetect');

function htmllint(config, done) {
  const maxChars = 5000;

  // increase child process buffer to accommodate large amounts of
  // validation output. (default is a paltry 200k.)
  // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  const maxBuffer = 20000 * 1024;

  // replace left/right quotation marks with normal quotation marks
  function normalizeQuotationMarks(str) {
    if (str) {
      str = str.replace(/[\u201c\u201d]/g, '"');
    }
    return str;
  }

  // parse and, if needed, normalize error messages from HttpClient to java -jar format
  // java -jar: one object containing messages for all files
  //   { messages: [{ message, type, url, ... }, ...] }
  // HttpClient: one object per file, separated by a newline, each object containing messages for only that file
  //   { messages: [{ message, type, ...}, ...], url }\n{ ... }
  function parseErrorMessages(errors) {
    const parsed = JSON.parse(config.server ? `[${errors.trim().replace(/\n/g, ',')}]` : errors);
    let { messages } = parsed;

    if (config.server) {
      // extract "messages" property from each object and set the url of each message
      // this results in an array of arrays instead of array of objects, which is then flattened by concatenation
      messages = Array.prototype.concat.apply([], parsed.map(file => {
        return file.messages.map(message => {
          message.url = file.url;
          return message;
        });
      }));
    }
    return messages;
  }

  // determine proper jarfile command and arguments
  function cmd(java, chunk) {
    let args = '';

    if (config.server) {
      if (config.server.host) {
        args += ` -Dnu.validator.client.host=${config.server.host}`;
      }
      if (config.server.port) {
        args += ` -Dnu.validator.client.port=${config.server.port}`;
      }
      args += ' -Dnu.validator.client.out=json nu.validator.client.HttpClient';
    } else {
      args += ' --format json';
    }
    if (config.noLangDetect) {
      args += ' --no-langdetect';
    }
    const invoke = `${config.server ? '-cp' : '-jar'} "${jar}"${args}`;

    // command to call java, increasing the default stack size for ia32 versions of the JRE and using the default setting for x64 versions
    return `java ${java.arch === 'ia32' ? '-Xss512k ' : ''}${invoke} ${chunk}`;
  }

  if (config.files.length === 0) {
    return done(null, []);
  }

  javadetect((err, java) => {
    if (err) {
      throw err;
    }

    const javaVersion = java.version.split('.').map(Number);

    if ((javaVersion[0] !== 1 && javaVersion[0] < 8) || (javaVersion[0] === 1 && javaVersion[1] < 8)) {
      throw new Error(`\nUnsupported Java version used: ${java.version}. Java 8 environment or up is required!`);
    }

    const files = config.files.map(path.normalize);

    async.mapSeries(chunkify(files, maxChars), (chunk, cb) => {
      exec(cmd(java, chunk, config.noLangDetect), {
        maxBuffer
      }, (error, stdout, stderr) => {
        if (error && (error.code !== 1 || error.killed || error.signal)) {
          cb(error);
          return;
        }

        stderr = config.server ? stdout : stderr;
        let result = [];

        if (stderr) {
          try {
            result = parseErrorMessages(stderr);
          } catch (error2) {
            throw new Error(`${error2}\nInvalid input follows below:\n\n${stderr}`);
          }
          result.forEach(message => {
            if (message.url) {
              message.file = path.relative('.', message.url.replace(path.sep !== '\\' ? 'file:' : 'file:/', ''));
            }
            if (config.absoluteFilePathsForReporter) {
              message.file = path.resolve(message.file);
            }
          });
          if (config.ignore) {
            const ignore = Array.isArray(config.ignore) ? config.ignore : [config.ignore];

            result = result.filter(message => {
              // Iterate over the ignore rules and test the message agains each rule.
              // A match should return false, which causes every() to return false and the message to be filtered out.
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

      let result = [];

      for (let r = 0, len = results.length; r < len; r++) {
        result = result.concat(results[r]);
      }
      done(null, result.filter(item => {
        return config.errorlevels.includes(item.type);
      }));
    });
  });
}

module.exports = htmllint;
