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
    if (file.content.indexOf('<!-- toc') === -1) {
      return next();
    }

    var fn = filter(app.option('toc.ignore'));

    // ignore toc comments for an entire template?
    if (file.data.toc === false) return next();

    // generate the actual toc and set it on `file.toc`
    file.toc = toc(file.content).content;
    file.content = toc.insert(file.content, {
      // pass the generated toc to use on the options
      toc: file.toc,
      // custom filter function for headings
      filter: fn
    });

    // unescape escaped `<!!-- toc` comments
    file.content = unescape(file.content);
    next();
  };
};

/**
 * Unescape escaped toc comments (`<!!-- toc`)
 */

function unescape(str) {
  return str.split('<!!-- toc').join('<!-- toc');
}

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
  if (typeof patterns === 'function') {
    return patterns;
  }

  return function (str) {
    var arr = ['\\[\\!\\[', '{%', '<%'].concat(patterns || []);
    var re = new RegExp(arr.join('|'));
    return !re.test(str);
  }
}
