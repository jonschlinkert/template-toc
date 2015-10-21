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
  return function (view, next) {
    if (view.content.indexOf('<!-- toc') === -1) {
      // unescape escaped `<!!-- toc` comments
      view.content = unescape(view.content);
      return next();
    }

    var opts = app.option('toc') || {};
    var fn = filter(opts.ignore);

    // ignore toc comments for an entire template
    if (view.options.toc === false) {
      return next();
    }

    // generate the actual toc and set it on `view.toc`
    if (typeof view.data.toc !== 'function') {
      view.data.toc = toc(view.content).content;
    }

    view.content = toc.insert(view.content, {
      // pass the generated toc to use on the opts
      toc: view.toc,
      // custom filter function for headings
      filter: fn,
      append: opts.append
    });

    // unescape escaped `<!!-- toc` comments
    view.content = unescape(view.content);
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
