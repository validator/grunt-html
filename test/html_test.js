'use strict';

var path = require('path');
var htmllint = require('../lib/htmllint');
var partials = require('../lib/partials');
var expectedResults = require('./support/expected_results');

function run(test, config, expected, message) {
  test.expect(1);
  // tests here
  htmllint(config, function(error, result) {
    if (error) {
      throw error;
    }
    // copy only the properties we want to test
    // url property is absolute, system-dependend path
    result = result.map(function(msg) {
      return {
        file: msg.file,
        type: msg.type,
        message: msg.message,
        lastLine: msg.lastLine,
        lastColumn: msg.lastColumn
      };
    });
    test.deepEqual(result, expected, message);
    test.done();
  });
}

exports.htmllint = {
  'all': {
    'with relative paths': function(test) {
      var expected = expectedResults.invalid;
      run(test, {
        files: ['test/valid.html', 'test/invalid.html']
      }, expected, 'four errors from test/invalid.html');
    },
    'with absolute paths': function(test) {
      var expected = expectedResults.invalid.map(function(result) {
        return {
          file: path.resolve(result.file),
          type: result.type,
          message: result.message,
          lastLine: result.lastLine,
          lastColumn: result.lastColumn
        };
      });
      run(test, {
        files: ['test/valid.html', 'test/invalid.html'],
        absoluteFilePathsForReporter: true
      }, expected, 'four errors from test/invalid.html');
    }
  },
  'empty': function(test) {
    run(test, {
      files: []
    }, [], '0 errors from 0 files');
  },
  'ignore': function(test) {
    run(test, {
      ignore: [
        'The "clear" attribute on the "br" element is obsolete. Use CSS instead.',
        'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
        /attribute “[a-z]+” not allowed/i
      ],
      files: ['test/valid.html', 'test/invalid.html']
    }, [
      {
        lastLine: 9,
        lastColumn: 96,
        type: 'error',
        message: 'An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
        file: path.join('test', 'invalid.html')
      }
    ], 'one error from test/invalid.html, other three were ignored');
  },
  'partialWrapperTemplatePath': function(test) {
    // mock up some data.
    var content = {
      'test/partialWrapper.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>Wrapper</title>\n</head>\n<body>\n<!-- CONTENT -->\n</body>\n</html>',
      'test/partialValid.html': '<img id="project-icon" src="images/transparent_1x1.png" class="ui-state-default" alt="default"><br style="clear:both" />'
    };
    var grunt = {
      file: {
        _written: {

        },
        read: function(path) {
          return content[path];
        },
        write: function(path, content) {
          this._written[path] = content;
        }
      }
    };
    var options = {
      partialWrapperTemplatePath: 'test/partialWrapper.html',
      files: ['test/partialValid.html']
    };
    var wrapData = {
      partialPath: options.partialWrapperTemplatePath,
      lineOffset: 0,
      tmpOutputDir: '.tmp-grunt-html'
    };
    // perform the test on mock data.
    var tmpPath = wrapData.tmpOutputDir + '/test/partialValid.html';
    partials(grunt, options, wrapData);
    // make sure contents are replaced correctly
    test.deepEqual(grunt.file._written[tmpPath], content['test/partialWrapper.html'].split('<!-- CONTENT -->').join(content['test/partialValid.html']));
    // make sure data is output correctly.
    var expected = {
      partialWrapperTemplatePath: 'test/partialWrapper.html',
      files: [tmpPath],// tmp file path.
      wrapData: {
        partialPath: 'test/partialWrapper.html',
        cache: {},
        lineOffset: 6,
        tmpOutputDir: '.tmp-grunt-html',
        files: [tmpPath]
      }
    };
    expected.wrapData.cache[tmpPath] = 'test/partialValid.html';
    test.deepEqual(options, expected, 'Files should be wrapped correctly.');
    test.done();
  }
};
