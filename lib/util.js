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
    if (string !== undefined) {
      string = string.replace(new RegExp(symbol, 'g'), pairs[symbol]);
    }
  }

  return string || '';
}

// Replace left/right quotation marks with normal quotation marks
function normalizeQuotationMarks(string) {
  if (string) {
    string = string.replace(/[\u201C\u201D]/g, '"');
  }

  return string;
}

module.exports = {
  encode,
  normalizeQuotationMarks
};
