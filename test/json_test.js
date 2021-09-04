'use strict';

const assert = require('assert').strict;
const reporter = require('../lib/reporters/json.js');
const expectedResults = require('./helpers/expected_results.js');

describe('json reporter', () => {
  it('when given empty result', done => {
    const result = [];
    const expected = '[]';
    const actual = reporter(result);

    assert.equal(actual, expected, 'Should return empty json array for empty result');
    done();
  });

  it('when given non-empty result', done => {
    const result = expectedResults.invalid;
    const expected = JSON.stringify(result);
    const actual = reporter(result);

    assert.equal(actual, expected, 'Should report errors as json array');
    done();
  });
});
