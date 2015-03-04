'use strict';

var path = require('path');
var stripColorCodes = require('stripcolorcodes');
var testCase  = require('nodeunit').testCase;
var reporters = require('../lib/reporters');

exports.reporters = testCase({
  'defaultReporter': testCase({
    'when given empty result': function(test) {
      var result = [],
        reporter = reporters.defaultReporter,
        expected = '',
        actual = stripColorCodes(reporter(result));
      test.equal(actual, expected, 'Should return empty String for empty result');
      test.done();
    },
    'when given non-empty result': function (test) {
      var result = [{
        lastLine: 1,
        lastColumn: 16,
        message: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
        file: path.join('test', 'invalid.html')
      }, {
        lastLine: 9,
        lastColumn: 96,
        message: 'Attribute “unknownattr” not allowed on element “img” at this point.',
        file: path.join('test', 'invalid.html')
      }],
        reporter = reporters.defaultReporter,
        expected = [
          'test/invalid.html [L1:C16] Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          'test/invalid.html [L9:C96] Attribute “unknownattr” not allowed on element “img” at this point.'
        ].join("\n"),
        actual = stripColorCodes(reporter(result));
      test.equal(actual, expected, 'Should report errors as a String');
      test.done();
    }
  })
});
