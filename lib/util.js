'use strict';

const pairs = {
  '&': '&amp;',
  '"': '&quot;',
  '\'': '&apos;',
  '<': '&lt;',
  '>': '&gt;'
};

function encode(string) {
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
