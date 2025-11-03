'use strict';

const assert = require('node:assert').strict;
const path = require('node:path');
const processErrorMessages = require('../lib/processErrorMessages.js');

describe('processErrorMessages', () => {
  describe('file path handling', () => {
    it('should decode URL-encoded file paths with spaces', () => {
      const errors = [{
        url: 'file:/C:/Users/test/Desktop/my%20project/test.html',
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      // The path should be decoded and relative
      assert.ok(!result[0].file.includes('%20'), 'File path should not contain URL encoding');
      assert.ok(result[0].file.includes('my project'), 'File path should have decoded spaces');
    });

    it('should decode URL-encoded file paths with special characters', () => {
      const errors = [{
        url: 'file:/C:/Users/test/project%20with%20%26%20special/test.html',
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(!result[0].file.includes('%20'), 'File path should not contain %20');
      assert.ok(!result[0].file.includes('%26'), 'File path should not contain %26');
      assert.ok(result[0].file.includes('&'), 'File path should have decoded ampersand');
    });

    it('should decode parentheses in file paths', () => {
      const errors = [{
        url: 'file:/C:/project%20%28test%29/file.html',
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(!result[0].file.includes('%28'), 'File path should not contain %28');
      assert.ok(!result[0].file.includes('%29'), 'File path should not contain %29');
      assert.ok(result[0].file.includes('(test)'), 'File path should have decoded parentheses');
    });

    it('should decode brackets and other special characters', () => {
      const errors = [{
        url: 'file:/C:/folder%20%5Btest%5D%20%26%20more/file%2B1%23.html',
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(!result[0].file.includes('%5B'), 'File path should not contain %5B');
      assert.ok(!result[0].file.includes('%5D'), 'File path should not contain %5D');
      assert.ok(!result[0].file.includes('%26'), 'File path should not contain %26');
      assert.ok(!result[0].file.includes('%2B'), 'File path should not contain %2B');
      assert.ok(!result[0].file.includes('%23'), 'File path should not contain %23');
      assert.ok(result[0].file.includes('[test]'), 'File path should have decoded brackets');
      assert.ok(result[0].file.includes('&'), 'File path should have decoded ampersand');
      assert.ok(result[0].file.includes('+'), 'File path should have decoded plus');
      assert.ok(result[0].file.includes('#'), 'File path should have decoded hash');
    });

    it('should decode percent signs in file paths', () => {
      const errors = [{
        url: 'file:/C:/project%2050%25/file.html',
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(result[0].file.includes('50%'), 'File path should have decoded percent sign');
    });

    it('should handle Unix-style file URLs', () => {
      const errors = [{
        url: 'file:/home/user/my%20project/test.html',
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(!result[0].file.includes('%20'), 'File path should not contain URL encoding');
    });

    it('should convert to relative paths by default', () => {
      const absolutePath = path.resolve('test/fixtures/invalid.html');
      const fileUrl = path.sep === '\\' ?
        `file:/${absolutePath.replaceAll('\\', '/')}` :
        `file:${absolutePath}`;

      const errors = [{
        url: fileUrl,
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(path.isAbsolute(result[0].file) === false, 'File path should be relative');
    });

    it('should convert to absolute paths when absoluteFilePathsForReporter is true', () => {
      const absolutePath = path.resolve('test/fixtures/invalid.html');
      const fileUrl = path.sep === '\\' ?
        `file:/${absolutePath.replaceAll('\\', '/')}` :
        `file:${absolutePath}`;

      const errors = [{
        url: fileUrl,
        message: 'Test error',
        type: 'error',
        lastLine: 1,
        lastColumn: 1
      }];
      const config = {
        absoluteFilePathsForReporter: true,
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.ok(path.isAbsolute(result[0].file), 'File path should be absolute');
    });
  });

  describe('message filtering with ignore', () => {
    it('should filter messages matching string ignore rule', () => {
      const errors = [
        {
          url: 'file:/test.html',
          message: 'This should be ignored',
          type: 'error',
          lastLine: 1,
          lastColumn: 1
        },
        {
          url: 'file:/test.html',
          message: 'This should remain',
          type: 'error',
          lastLine: 2,
          lastColumn: 1
        }
      ];
      const config = {
        ignore: 'This should be ignored',
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.equal(result[0].message, 'This should remain');
    });

    it('should filter messages matching regex ignore rule', () => {
      const errors = [
        {
          url: 'file:/test.html',
          message: 'Attribute "data-test" not allowed',
          type: 'error',
          lastLine: 1,
          lastColumn: 1
        },
        {
          url: 'file:/test.html',
          message: 'This should remain',
          type: 'error',
          lastLine: 2,
          lastColumn: 1
        }
      ];
      const config = {
        ignore: /attribute "[a-z-]+" not allowed/i,
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.equal(result[0].message, 'This should remain');
    });

    it('should filter messages matching multiple ignore rules', () => {
      const errors = [
        {
          url: 'file:/test.html',
          message: 'First ignore pattern',
          type: 'error',
          lastLine: 1,
          lastColumn: 1
        },
        {
          url: 'file:/test.html',
          message: 'Second ignore pattern',
          type: 'error',
          lastLine: 2,
          lastColumn: 1
        },
        {
          url: 'file:/test.html',
          message: 'This should remain',
          type: 'error',
          lastLine: 3,
          lastColumn: 1
        }
      ];
      const config = {
        ignore: ['First ignore pattern', /second ignore/i],
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.equal(result[0].message, 'This should remain');
    });

    it('should handle messages without ignore rules', () => {
      const errors = [
        {
          url: 'file:/test.html',
          message: 'Error message 1',
          type: 'error',
          lastLine: 1,
          lastColumn: 1
        },
        {
          url: 'file:/test.html',
          message: 'Error message 2',
          type: 'error',
          lastLine: 2,
          lastColumn: 1
        }
      ];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty error array', () => {
      const errors = [];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 0);
    });

    it('should preserve all message properties', () => {
      const errors = [{
        url: 'file:/test.html',
        message: 'Test error',
        type: 'error',
        lastLine: 10,
        lastColumn: 20,
        firstLine: 8,
        firstColumn: 5,
        hiliteStart: 100,
        hiliteLength: 15
      }];
      const config = {
        errorlevels: ['error']
      };

      const result = processErrorMessages(errors, config);

      assert.equal(result.length, 1);
      assert.equal(result[0].message, 'Test error');
      assert.equal(result[0].type, 'error');
      assert.equal(result[0].lastLine, 10);
      assert.equal(result[0].lastColumn, 20);
      assert.equal(result[0].firstLine, 8);
      assert.equal(result[0].firstColumn, 5);
      assert.equal(result[0].hiliteStart, 100);
      assert.equal(result[0].hiliteLength, 15);
    });
  });
});
