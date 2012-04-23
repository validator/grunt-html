var grunt = require('grunt');

exports['htmllint'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'helper': function(test) {
    test.expect(1);
    // tests here
    grunt.helper('htmllint', ['test/valid.html', 'test/invalid.html'], function(error, result) {
      if (error) {
        throw error;
      }
      test.deepEqual(result, [
        '"test/invalid.html":10.1-10.81: error: An "img" element must have an "alt" attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
        '"test/invalid.html":12.1-12.19: error: The "clear" attribute on the "br" element is obsolete. Use CSS instead.',
        '"test/invalid.html": info warning: The character encoding of the document was not declared.'
      ], 'three errors from test/invalid.html');
      test.done();
    });
  }
};
