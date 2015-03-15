/*!
 * template-toc <https://github.com/jonschlinkert/template-toc>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');
var toc = require('markdown-toc');

module.exports = function (app) {
  var defaults = app.option('toc');

  return function (file, next) {
    var fn = filter(app.option('toc.ignore'));

    // ignore toc comments for an entire template
    if (file.data.toc === false) return next();
    file.content = toc.insert(file.content, {filter: fn});

    // selectively ignore TOC comments that are escaped
    file.content = file.content.split('<!!-- toc').join('<!-- toc');
    next();
  };
};

/**
 * Default filter function for ignoring specified headings
 * or heading patterns in the generated TOC. Ignore patterns
 * may be passed on the options:
 *
 * ```js
 * app.option('toc.ignore', ['foo', 'bar']);
 * ```
 */

function filter(patterns) {
  return function (str) {
    var arr = ['\\[\\!\\[', '{%', '<%'].concat(patterns || []);
    var re = new RegExp(arr.join('|'));
    return !re.test(str);
  }
}
