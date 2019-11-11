'use strict';

const assert = require('assert');
const path = require('path');
const stripColorCodes = require('stripcolorcodes');
const reporters = require('../lib/reporters');
const checkstyleReporter = require('../lib/reporters/checkstyle');
const jsonReporter = require('../lib/reporters/json');
const junitReporter = require('../lib/reporters/junit');
const customReporter = require('./helpers/custom_reporter');
const expectedResults = require('./helpers/expected_results');

describe('reporter selection', () => {
  it('Should return default reporter', () => {
    const options = {};
    const reporter = reporters.selectReporter(options);
    assert.strictEqual(reporter, reporters.defaultReporter);
  });
  it('Should return checkstyle reporter', () => {
    const options = { reporter: 'checkstyle' };
    const reporter = reporters.selectReporter(options);
    assert.strictEqual(reporter, checkstyleReporter);
  });
  it('Should return json reporter', () => {
    const options = { reporter: 'json' };
    const reporter = reporters.selectReporter(options);
    assert.strictEqual(reporter, jsonReporter);
  });
  it('Should return junit reporter', () => {
    const options = { reporter: 'junit' };
    const reporter = reporters.selectReporter(options);
    assert.strictEqual(reporter, junitReporter);
  });
  it('Should return custom reporter', () => {
    const options = {
      reporter: 'tests/helpers/custom_reporter.js'
    };
    const reporter = reporters.selectReporter(options);
    assert.strictEqual(reporter, customReporter);
  });
  it('Should throw error when invalid custom reporter is specified', () => {
    const options = {
      reporter: 'does/not/exist.js'
    };

    assert.throws(
      () => {
        reporters.selectReporter(options);
      },
      Error, 'Should throw an error'
    );
  });
});

describe('default reporter', () => {
  it('Should report errors as a String', () => {
    const invalidHtml = path.normalize('tests/fixtures/invalid.html');
    const result = expectedResults.invalid;
    const reporter = reporters.defaultReporter;
    const expected = [
      `${invalidHtml} [L1:C16] Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.`,
      `${invalidHtml} [L10:C96] Attribute “unknownattr” not allowed on element “img” at this point.`,
      `${invalidHtml} [L10:C96] An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.`,
      `${invalidHtml} [L12:C19] The “clear” attribute on the “br” element is obsolete. Use CSS instead.`
    ].join('\n');
    const actual = stripColorCodes(reporter(result));

    assert.strictEqual(actual, expected);
  });
  it('Should return empty String for empty result', () => {
    const result = [];
    const reporter = reporters.defaultReporter;
    const expected = '';
    const actual = reporter(result);

    assert.strictEqual(actual, expected);
  });
});

describe('json reporter', () => {
  const reporter = require('../lib/reporters/json');
  it('Should report errors as json array', () => {
    const result = expectedResults.invalid;
    const expected = JSON.stringify(result);
    const actual = reporter(result);
    assert.strictEqual(actual, expected);
  });
  it('Should return empty json array for empty result', () => {
    const result = [];
    const expected = '[]';
    const actual = reporter(result);
    assert.strictEqual(actual, expected);
  });
});

describe('checkstyle reporter', () => {
  const reporter = require('../lib/reporters/checkstyle');
  it('Should report errors as checkstyle XML', () => {
    const results = [...expectedResults.invalid, ...expectedResults.noLang];
    const filenames = [path.normalize('tests/fixtures/invalid.html'), path.normalize('tests/fixtures/no-lang.html')];
    const expected = [
      '<?xml version="1.0" encoding="utf-8"?><checkstyle>',
      `\t<file name="${filenames[0]}">`,
      '\t\t<error line="1" column="16" severity="error" message="Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”." source="htmllint.ValidationError" />',
      '\t\t<error line="10" column="96" severity="error" message="Attribute “unknownattr” not allowed on element “img” at this point." source="htmllint.ValidationError" />',
      '\t\t<error line="10" column="96" severity="error" message="An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images." source="htmllint.ValidationError" />',
      '\t\t<error line="12" column="19" severity="error" message="The “clear” attribute on the “br” element is obsolete. Use CSS instead." source="htmllint.ValidationError" />',
      '\t</file>',
      `\t<file name="${filenames[1]}">`,
      '\t\t<error line="2" column="6" severity="info" message="Consider adding a “lang” attribute to the “html” start tag to declare the language of this document." source="htmllint.ValidationWarning" />',
      '\t</file>',
      '</checkstyle>'
    ].join('\n');
    const actual = reporter(results);

    assert.strictEqual(actual, expected);
  });
  it('Should return empty checkstyle XML for empty result', () => {
    const result = [];
    const expected = '<?xml version="1.0" encoding="utf-8"?><checkstyle>\n</checkstyle>';
    const actual = reporter(result);

    assert.strictEqual(actual, expected);
  });
});

describe('junit reporter', () => {
  const reporter = require('../lib/reporters/junit');
  it('Should report errors as JUnit XML', () => {
    const results = [...expectedResults.invalid, ...expectedResults.noLang];
    const filenames = [path.normalize('tests/fixtures/invalid.html'), path.normalize('tests/fixtures/no-lang.html')];
    const expected = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<testsuite name="htmllint" tests="2" failures="0" errors="5">',
      `<testcase name="${filenames[0]}">`,
      '<error message="4 Errors">',
      '1 line 1, char 16: Start tag seen without seeing a doctype first. Expected “&lt;!DOCTYPE html&gt;”.',
      '2 line 10, char 96: Attribute “unknownattr” not allowed on element “img” at this point.',
      '3 line 10, char 96: An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
      '4 line 12, char 19: The “clear” attribute on the “br” element is obsolete. Use CSS instead.',
      '</error>',
      '</testcase>',
      `<testcase name="${filenames[1]}">`,
      '<error message="1 Errors">',
      '1 line 2, char 6: Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.',
      '</error>',
      '</testcase>',
      '</testsuite>'
    ].join('\n');
    const actual = reporter(results);
    assert.strictEqual(actual, expected);
  });
  it('Should return empty JUnit XML for empty result', () => {
    const result = [];
    const expected = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<testsuite name="htmllint" tests="0" failures="0" errors="0">',
      '</testsuite>'
    ].join('\n');
    const actual = reporter(result);

    assert.strictEqual(actual, expected);
  });
});
