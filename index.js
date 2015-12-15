/*!
 * template-toc <https://github.com/jonschlinkert/template-toc>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isPrimitive = require('is-primitive');
var extend = require('extend-shallow');
var toc = require('markdown-toc');

module.exports = function(app, options) {
  return function(view, next) {
    // unescape escaped `<!!-- toc` comments
    if (!/({%=|<\!--) toc/.test(view.content)) {
      view.content = unescape(view.content);
      view.data.toc = '';
      return next();
    }

    var opts = extend({}, app.options, view.options);
    if (typeof opts.toc === 'undefined') {
      opts.toc = {};
    }

    if (isPrimitive(opts.toc)) {
      opts.render = opts.toc;
      opts.toc = { render: opts.render };
    }

    opts = extend({}, options, opts.toc);
    opts.toc = opts.toc || {};
    view.options.toc = opts.toc;

    // ignore toc comments for an entire template?
    if (opts.render === false) {
      return next();
    }

    var fn = filter(opts.ignore);
    opts.filter = fn;

    // generate the actual toc and set it on `view.toc`
    if (typeof view.data.toc !== 'function') {
      view.data.toc = toc(view.content, opts).content;
      var lines = view.data.toc.split('\n');
      var len = lines.length;
      var res = [];
      while (len--) {
        var line = lines[len];
        if (res.indexOf(line) < 0) {
          res.unshift(line);
        }
      }
      view.data.toc = res.join('\n');
      view.data.hasToc = true;
    }

    if (opts.noinsert || !opts.insert || opts.inserted) {
      return next();
    }

    view.options.toc.inserted = true;
    view.content = toc.insert(view.content, {
      // pass the generated toc to use on the opts
      toc: view.data.toc,
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

  return function(str) {
    var arr = ['\\[\\!\\[', '{%', '<%'].concat(patterns || []);
    var re = new RegExp(arr.join('|'));
    return !re.test(str);
  };
}
