'use strict';

const assert = require('assert');
const reporter = require('../lib/reporters/json');
const expectedResults = require('./helpers/expected_results');

describe('json reporter', () => {
  it('when given empty result', done => {
    const result = [];
    const expected = '[]';
    const actual = reporter(result);

    assert.strictEqual(actual, expected, 'Should return empty json array for empty result');
    done();
  });

  it('when given non-empty result', done => {
    const result = expectedResults.invalid;
    const expected = JSON.stringify(result);
    const actual = reporter(result);

    assert.strictEqual(actual, expected, 'Should report errors as json array');
    done();
  });
});
