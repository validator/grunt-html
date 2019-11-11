'use strict';

const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// const execSync = require('child_process').execSync;
const jar = require('vnu-jar');
const chunkify = require('./chunkify');

const getBaseCommand = (config, javaArchitecture) => {
  let args = '';
  if (config.server) {
    if (config.server.host) {
      args += ` -Dnu.validator.client.host=${config.server.host}`;
    }

    if (config.server.port) {
      args += ` -Dnu.validator.client.port=${config.server.port}`;
    }

    if (config.server.charset) {
      args += ` -Dnu.validator.client.charset=${config.server.charset}`;
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
  return `java ${javaArchitecture === 'ia32' ? '-Xss512k ' : ''}${invoke}`;
};

async function htmllint(config) {
  const MAX_CHARS = config.maxCharsPerChunk || 5000;

  // increase child process buffer to accommodate large amounts of
  // validation output. (the default is a paltry 200k)
  // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  const MAX_BUFFER = 20000 * 1024;

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
      messages = [].concat(...parsed.map(file =>
        file.messages.map(message => {
          message.url = file.url;
          message.message = message.message.replace('�?', '”');
          return message;
        })
      ));
    }

    return messages;
  }

  if (config.files.length === 0) {
    return [];
  }

  // Get java version and architecture information.
  const { stderr } = await exec('java -version');
  const java = {
    version: stderr.match(/(?:java|openjdk) version "(.*)"/)[1],
    arch: stderr.match(/64-Bit/) ? 'x64' : 'ia32'
  };
  const javaVersion = java.version.split('.').map(Number);

  if ((javaVersion[0] !== 1 && javaVersion[0] < 8) || (javaVersion[0] === 1 && javaVersion[1] < 8)) {
    throw new Error(`\nUnsupported Java version used: ${java.version}. Java 8 environment or up is required!`);
  }

  const files = config.files.map(path.normalize);

  // BaseCommand will be "java -jar <location of vnu-jar> --format json" for example.
  const baseCommand = getBaseCommand(config, java.arch);

  // Create and execute the commands to run for each chunk.
  // Take every chunk and append to baseCommand to run.
  // 'commands' will be an array of promises.
  const commands = chunkify(files, MAX_CHARS).map(chunk => exec(`${baseCommand} ${chunk}`, { maxBuffer: MAX_BUFFER }));

  // Wait until all commands are finished. Aggregate all results into one feedback array.
  const feedback = await Promise.all(commands.map(p => p.catch(error => error)));

  // Check if any of the commands experienced an unexpected error. If so, throw.
  const failure = feedback.find(f => f.code && (f.code !== 1 || f.killed || f.signal));
  if (failure) {
    throw failure;
  }

  let results = [];

  feedback.forEach(f => {
    const messages = config.server ? f.stdout : f.stderr;
    try {
      results.push(...parseErrorMessages(messages));
    } catch (error) {
      throw new Error(`${error}\nInvalid input follows below:\n\n${messages}`);
    }
  });

  results.forEach(message => {
    if (message.url) {
      // eslint-disable-next-line no-negated-condition
      message.file = path.relative('.', message.url.replace(path.sep !== '\\' ? 'file:' : 'file:/', ''));
    }

    if (config.absoluteFilePathsForReporter) {
      message.file = path.resolve(message.file);
    }
  });
  // Helper function to replace left/right quotation marks with normal quotation marks.
  const normalizeQuotationMarks = str => str ? str.replace(/[\u201C\u201D]/g, '"') : str;

  if (config.ignore) {
    const ignore = (Array.isArray(config.ignore) ? config.ignore : [config.ignore])
      .map(rule => rule instanceof RegExp ? rule : normalizeQuotationMarks(rule));

    // Iterate over the ignore rules and test the message against each rule.
    // A match should return false, which causes every() to return false and the message to be filtered out.
    results = results.filter(message => {
      const normalizedMessage = normalizeQuotationMarks(message.message);
      return ignore.every(ignoreRule => ignoreRule instanceof RegExp ? !ignoreRule.test(message.message) : ignoreRule !== normalizedMessage);
    });
  }

  return results;
}

module.exports = htmllint;
