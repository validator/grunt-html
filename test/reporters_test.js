const path = require('path');
const stripColorCodes = require('stripcolorcodes');
const reporters = require('../lib/reporters');
const checkstyleReporter = require('../lib/reporters/checkstyle');
const jsonReporter = require('../lib/reporters/json');
const junitReporter = require('../lib/reporters/junit');
const customReporter = require('./helpers/custom_reporter');
const expectedResults = require('./helpers/expected_results');

exports.reporters = {
  defaultReporter: {
    'when given empty result': (test) => {
      const result = [];
      const reporter = reporters.defaultReporter;
      const expected = '';
      const actual = reporter(result);

      test.equal(actual, expected, 'Should return empty String for empty result');
      test.done();
    },
    'when given non-empty result': (test) => {
      const invalidHtml = path.normalize('test/fixtures/invalid.html');
      const result = expectedResults.invalid;
      const reporter = reporters.defaultReporter;
      const expected = [
        `${invalidHtml} [L1:C16] Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.`,
        `${invalidHtml} [L9:C96] Attribute “unknownattr” not allowed on element “img” at this point.`,
        `${invalidHtml} [L9:C96] An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.`,
        `${invalidHtml} [L11:C19] The “clear” attribute on the “br” element is obsolete. Use CSS instead.`
      ].join('\n');
      const actual = stripColorCodes(reporter(result));

      test.equal(actual, expected, 'Should report errors as a String');
      test.done();
    }
  },
  selectReporter: {
    'when no reporter is specified': (test) => {
      const options = {};
      const reporter = reporters.selectReporter(options);

      test.equal(reporter, reporters.defaultReporter, 'Should return default reporter');
      test.done();
    },
    'when checkstyle reporter is specified': (test) => {
      const options = {
        reporter: 'checkstyle'
      };
      const reporter = reporters.selectReporter(options);

      test.equal(reporter, checkstyleReporter, 'Should return checkstyle reporter');
      test.done();
    },
    'when json reporter is specified': (test) => {
      const options = {
        reporter: 'json'
      };
      const reporter = reporters.selectReporter(options);

      test.equal(reporter, jsonReporter, 'Should return json reporter');
      test.done();
    },
    'when junit reporter is specified': (test) => {
      const options = {
        reporter: 'junit'
      };
      const reporter = reporters.selectReporter(options);

      test.equal(reporter, junitReporter, 'Should return junit reporter');
      test.done();
    },
    'when valid custom reporter is specified': (test) => {
      const options = {
        reporter: 'test/helpers/custom_reporter.js'
      };
      const reporter = reporters.selectReporter(options);

      test.equal(reporter, customReporter, 'Should return custom reporter');
      test.done();
    },
    'when invalid custom reporter is specified': (test) => {
      const options = {
        reporter: 'does/not/exist.js'
      };

      test.throws(
        () => {
          reporters.selectReporter(options);
        },
        Error, 'Should throw an error'
      );
      test.done();
    }
  }
};
