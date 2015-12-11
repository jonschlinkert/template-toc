'use strict';

require('mocha');
var path = require('path');
var should = require('should');
var Templates = require('templates');
var loader = require('assemble-loader');
var toc = require('./');
var app;

describe('toc', function () {
  beforeEach(function () {
    app = new Templates();
    app.use(loader());
    app.engine('md', require('engine-base'));
    app.create('pages', {
      renameKey: function(key) {
        return path.basename(key);
      }
    });
    app.create('partials', {
      viewType: 'partial',
      renameKey: function(key) {
        return path.basename(key);
      }
    });

    app.pages.loadView('fixtures/basic.md');
    app.partials.loadView('fixtures/doc.md');
  });

  it('should work as an onLoad middleware:', function (done) {
    app.onLoad(/\.md$/, toc(app, {insert: true}));
    // with `.onLoad()`, we need to load the templates AFTER the
    // middleware is defined. other stages it doesn't matter
    app.pages.loadView('fixtures/basic.md');
    app.partials.loadView('fixtures/doc.md');

    // render `./fixtures/basic.md`
    app.render('basic.md', function (err, res) {
      if (err) return done(err);
      res.content.should.equal([
        '# Basic markdown',
        '',
        '> This is a block quote',
        '',
        '<!-- toc -->',
        '',
        '- [AAA](#aaa)',
        '',
        '<!-- tocstop -->',
        '',
        '## AAA',
        '',
        'This is aaa.',
        '',
        '### BBB',
        'This is bbb.',
        '',
        '#### CCC',
        'This is ccc.',
        '',
        '##### DDD',
        'This is ddd.\n'
      ].join('\n'));
      done();
    });
  });

  it('should work as a preRender middleware:', function (done) {
    app.preRender(/\.md$/, toc(app, {insert: true}));
    app.pages.loadView('fixtures/basic.md');
    app.partials.loadView('fixtures/doc.md');

    // render `./fixtures/basic.md`
    app.render('basic.md', function (err, res) {
      if (err) return done(err);

      res.content.should.equal([
        '# Basic markdown',
        '',
        '> This is a block quote',
        '',
        '<!-- toc -->',
        '',
        '- [AAA](#aaa)',
        '',
        '<!-- tocstop -->',
        '',
        '## AAA',
        '',
        'This is aaa.',
        '',
        '### BBB',
        'This is bbb.',
        '',
        '#### CCC',
        'This is ccc.',
        '',
        '##### DDD',
        'This is ddd.\n'
      ].join('\n'));
      done();
    });
  });

  it('should work as a postRender middleware:', function (done) {
    app.postRender(/\.md$/, toc(app, {insert: true}));

    // render `./fixtures/basic.md`
    app.render('basic.md', function (err, res) {
      if (err) return done(err);
      res.content.should.equal([
        '# Basic markdown',
        '',
        '> This is a block quote',
        '',
        '<!-- toc -->',
        '',
        '- [AAA](#aaa)',
        '  * [BBB](#bbb)',
        '    + [CCC](#ccc)',
        '      ~ [DDD](#ddd)',
        '',
        '<!-- tocstop -->',
        '',
        '## AAA',
        '',
        'This is aaa.',
        '',
        '### BBB',
        'This is bbb.',
        '',
        '#### CCC',
        'This is ccc.',
        '',
        '##### DDD',
        'This is ddd.',
      ].join('\n'));
      done();
    });
  });

  it('should use options from app:', function (done) {
    app.option({
      toc: {
        append: '\n\n_(Table of contents generated by [verb])_',
        ignore: ['BBB']
      }
    });

    app.pages.loadView('fixtures/basic.md');
    app.partials.loadView('fixtures/doc.md');
    app.postRender(/\.md$/, toc(app, {insert: true}));

    // render `./fixtures/basic.md`
    app.render('basic.md', function (err, res) {
      if (err) return done(err);
      res.content.should.equal([
        '# Basic markdown',
        '',
        '> This is a block quote',
        '',
        '<!-- toc -->',
        '',
        '- [AAA](#aaa)',
        '    + [CCC](#ccc)',
        '      ~ [DDD](#ddd)',
        '',
        '_(Table of contents generated by [verb])_',
        '',
        '<!-- tocstop -->',
        '',
        '## AAA',
        '',
        'This is aaa.',
        '',
        '### BBB',
        'This is bbb.',
        '',
        '#### CCC',
        'This is ccc.',
        '',
        '##### DDD',
        'This is ddd.',
      ].join('\n'));
      done();
    });
  });
});
