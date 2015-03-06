'use strict';

var path = require('path');
var reporter = require('../lib/reporters/json');

exports.reporters = {
  'json reporter': {
    'when given empty result': function(test) {
      var result = [],
        expected = '[]',
        actual = reporter(result);
      test.equal(actual, expected, 'Should return empty json array for empty result');
      test.done();
    },
    'when given non-empty result': function(test) {
      var invalid_html = path.join('test', 'invalid.html'),
        result = [{
          lastLine: 1,
          lastColumn: 16,
          type: 'error',
          message: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          file: invalid_html
        }, {
          lastLine: 9,
          lastColumn: 96,
          type: 'error',
          message: 'Attribute “unknownattr” not allowed on element “img” at this point.',
          file: invalid_html
        }],
        expected = JSON.stringify(result),
        actual = reporter(result);
      test.equal(actual, expected, 'Should report errors as json array');
      test.done();
    }
  }
};
