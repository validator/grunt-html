'use strict';

const assert = require('assert');
const path = require('path');
const stripAnsi = require('strip-ansi');
const reporters = require('../lib/reporters.js');
const checkstyleReporter = require('../lib/reporters/checkstyle.js');
const jsonReporter = require('../lib/reporters/json.js');
const junitReporter = require('../lib/reporters/junit.js');
const customReporter = require('./helpers/custom_reporter.js');
const expectedResults = require('./helpers/expected_results.js');

describe('reporters', () => {
  describe('default reporter', () => {
    it('when given empty result', done => {
      const result = [];
      const reporter = reporters.defaultReporter;
      const expected = '';
      const actual = reporter(result);

      assert.strictEqual(actual, expected, 'Should return empty String for empty result');
      done();
    });

    it('when given non-empty result', done => {
      const invalidHtml = path.normalize('test/fixtures/invalid.html');
      const result = expectedResults.invalid;
      const reporter = reporters.defaultReporter;
      const expected = [
        `${invalidHtml} [L1:C16] Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.`,
        `${invalidHtml} [L9:C96] Attribute “unknownattr” not allowed on element “img” at this point.`,
        `${invalidHtml} [L9:C96] An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.`,
        `${invalidHtml} [L11:C19] The “clear” attribute on the “br” element is obsolete. Use CSS instead.`
      ].join('\n');
      const actual = stripAnsi(reporter(result));

      assert.strictEqual(actual, expected, 'Should report errors as a String');
      done();
    });
  });

  describe('select reporter', () => {
    it('when no reporter is specified', done => {
      const options = {};
      const reporter = reporters.selectReporter(options);

      assert.strictEqual(reporter, reporters.defaultReporter, 'Should return default reporter');
      done();
    });

    it('when checkstyle reporter is specified', done => {
      const options = {
        reporter: 'checkstyle'
      };
      const reporter = reporters.selectReporter(options);

      assert.strictEqual(reporter, checkstyleReporter, 'Should return checkstyle reporter');
      done();
    });

    it('when json reporter is specified', done => {
      const options = {
        reporter: 'json'
      };
      const reporter = reporters.selectReporter(options);

      assert.strictEqual(reporter, jsonReporter, 'Should return json reporter');
      done();
    });

    it('when junit reporter is specified', done => {
      const options = {
        reporter: 'junit'
      };
      const reporter = reporters.selectReporter(options);

      assert.strictEqual(reporter, junitReporter, 'Should return junit reporter');
      done();
    });

    it('when valid custom reporter is specified', done => {
      const options = {
        reporter: 'test/helpers/custom_reporter.js'
      };
      const reporter = reporters.selectReporter(options);

      assert.strictEqual(reporter, customReporter, 'Should return custom reporter');
      done();
    });

    it('when invalid custom reporter is specified', done => {
      const options = {
        reporter: 'does/not/exist.js'
      };

      assert.throws(
        () => {
          reporters.selectReporter(options);
        },
        Error, 'Should throw an error'
      );
      done();
    });
  });
});
