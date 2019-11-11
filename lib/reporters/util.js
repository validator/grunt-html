'use strict';

function encode(s = '') {
  const pairs = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;'
  };
  Object.keys(pairs).forEach(k => {
    s = s.replace(new RegExp(k, 'g'), pairs[k]);
  });
  return s;
}

module.exports = {
  encode
};
