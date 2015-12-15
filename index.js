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
    if (!/({%=|<!--) toc/.test(view.content)) {
      view.content = unescape(view.content);
      view.data.toc = '';
      next();
      return;
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
      next();
      return;
    }

    var fn = filter(opts.ignore);
    opts.filter = fn;

    try {
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
    } catch (err) {
      next(err);
      return;
    }

    if (view.options.toc.inserted === true) {
      next();
      return;
    }

    if ((opts.noinsert && !opts.insert) || opts.inserted) {
      view.content = placeholder(view.content);
      view.insertToc = function(str, toc) {
        view.options.toc.inserted = true;
        return insert(str, toc);
      };

      next();
      return;
    }

    view.options.toc.inserted = true;
    view.unescapeToc = function(str) {
      return unescape(str);
    };

    try {
      view.content = toc.insert(view.content, {
        // pass the generated toc to use on the opts
        toc: view.data.toc,
        // custom filter function for headings
        filter: fn,
        append: opts.append
      });

      // insert TOC and unescape escaped `<!!-- toc` comments
      view.content = unescape(view.content);
      next(null, view);
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Replace `toc` comment so it doesn't get re-rendered before
 * injecting the toc
 */

function placeholder(str) {
  return str.split('<!-- toc -->').join('<!-- rendered_toc -->');
}

/**
 * Replace the placeholder with the actual toc
 */

function insert(str, toc) {
  return str.split('<!-- rendered_toc -->').join(toc);
}

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
