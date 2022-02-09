'use strict';

const expectedResults = require('./helpers/expected_results.js');
const run = require('./helpers/run.js');

describe('htmllint', () => {
  describe('server', () => {
    it('with relative paths using server', done => {
      const options = {
        files: ['test/fixtures/valid.html', 'test/fixtures/invalid.html'],
        server: {
          host: '127.0.0.1',
          port: 8080
        },
        errorlevels: ['info', 'warning', 'error']
      };
      const expected = expectedResults.server.invalid;

      run(options, expected, 'four errors from test/fixtures/invalid.html', done);
    });
  });
});
