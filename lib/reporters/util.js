'use strict';

function encode(string) {
  const pairs = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;'
  };

  for (const symbol in pairs) {
    if (typeof string !== 'undefined') {
      string = string.replace(new RegExp(symbol, 'g'), pairs[symbol]);
    }
  }

  return string || '';
}

module.exports = {
  encode
};
