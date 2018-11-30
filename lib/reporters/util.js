'use strict';

function encode(s) {
  const pairs = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;'
  };

  for (const r in pairs) {
    if (typeof s !== 'undefined') {
      s = s.replace(new RegExp(r, 'g'), pairs[r]);
    }
  }
  return s || '';
}

module.exports = {
  encode
};
