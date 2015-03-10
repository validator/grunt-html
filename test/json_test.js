'use strict';

var reporter = require('../lib/reporters/json');
var expectedResults = require('./support/expected_results');

exports.json = {
  'json reporter': {
    'when given empty result': function(test) {
      var result = [],
        expected = '[]',
        actual = reporter(result);
      test.equal(actual, expected, 'Should return empty json array for empty result');
      test.done();
    },
    'when given non-empty result': function(test) {
      var result = expectedResults.invalid,
        expected = JSON.stringify(result),
        actual = reporter(result);
      test.equal(actual, expected, 'Should report errors as json array');
      test.done();
    }
  }
};
