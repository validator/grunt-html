const reporter = require('../lib/reporters/json');
const expectedResults = require('./helpers/expected_results');

exports.json = {
  'json reporter': {
    'when given empty result': test => {
      const result = [];
      const expected = '[]';
      const actual = reporter(result);

      test.equal(actual, expected, 'Should return empty json array for empty result');
      test.done();
    },
    'when given non-empty result': test => {
      const result = expectedResults.invalid;
      const expected = JSON.stringify(result);
      const actual = reporter(result);

      test.equal(actual, expected, 'Should report errors as json array');
      test.done();
    }
  }
};
