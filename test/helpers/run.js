'use strict';

const assert = require('node:assert').strict;
const htmllint = require('../../lib/htmllint.js');

function run(config, expected, message, done) {
  htmllint(config, (error, result) => {
    if (error) {
      throw error;
    }

    // Only keep the properties we want to test;
    // the url property is an absolute, system-dependent path
    const newResult = result.map(({ file, type, message, lastLine, lastColumn }) => ({ file, type, message, lastLine, lastColumn }));
    assert.deepEqual(newResult, expected, message);
    done();
  });
}

module.exports = run;
