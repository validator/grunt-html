'use strict';

const jar = require('vnu-jar');

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

module.exports = javaArgs;
