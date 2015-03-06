'use strict';

var path = require('path');
var stripColorCodes = require('stripcolorcodes');
var reporters = require('../lib/reporters');

exports.reporters = {
  'defaultReporter': {
    'when given empty result': function(test) {
      var result = [],
        reporter = reporters.defaultReporter,
        expected = '',
        actual = stripColorCodes(reporter(result));
      test.equal(actual, expected, 'Should return empty String for empty result');
      test.done();
    },
    'when given non-empty result': function(test) {
      var invalid_html = path.join('test', 'invalid.html'),
        result = [{
          lastLine: 1,
          lastColumn: 16,
          message: 'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          file: invalid_html
        }, {
          lastLine: 9,
          lastColumn: 96,
          message: 'Attribute “unknownattr” not allowed on element “img” at this point.',
          file: invalid_html
        }],
        reporter = reporters.defaultReporter,
        expected = [
          invalid_html + ' [L1:C16] Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          invalid_html + ' [L9:C96] Attribute “unknownattr” not allowed on element “img” at this point.'
        ].join("\n"),
        actual = stripColorCodes(reporter(result));
      test.equal(actual, expected, 'Should report errors as a String');
      test.done();
    }
  },
  'selectReporter': {
    'when no reporter is specified': function(test) {
      var options = {},
        reporter = reporters.selectReporter(options);
      test.equal(reporter, reporters.defaultReporter, 'Should return default reporter');
      test.done();
    },
    'when checkstyle reporter is specified': function(test) {
      var options = {
        reporter: 'checkstyle'
      },
        reporter = reporters.selectReporter(options),
        checkstyleReporter = require('../lib/reporters/checkstyle');
      test.equal(reporter, checkstyleReporter, 'Should return checkstyle reporter');
      test.done();
    },
    'when json reporter is specified': function(test) {
      var options = {
        reporter: 'json'
      },
        reporter = reporters.selectReporter(options),
        jsonReporter = require('../lib/reporters/json');
      test.equal(reporter, jsonReporter, 'Should return json reporter');
      test.done();
    },
    'when valid custom reporter is specified': function(test) {
      var options = {
        reporter: 'test/support/custom_reporter.js'
      },
        reporter = reporters.selectReporter(options),
        customReporter = require('./support/custom_reporter');
      test.equal(reporter, customReporter, 'Should return custom reporter');
      test.done();
    },
    'when invalid custom reporter is specified': function(test) {
      var options = {
        reporter: 'does/not/exist.js'
      };
      test.throws(
        function() {
          reporters.selectReporter(options);
        },
        Error, 'Should throw an error'
      );
      test.done();
    }
  }
};
