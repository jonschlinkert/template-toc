/*!
 * template-toc <https://github.com/jonschlinkert/template-toc>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps:mocha */
var should = require('should');
var Template = require('template');
var toc = require('./');
var template;

describe('toc', function () {
  beforeEach(function () {
    template = new Template();
    template.page('fixture.md', [
      '# Basic markdown',
      '',
      '> This is a block quote',
      '',
      '<!-- toc -->',
      '',
      '## AAA',
      '',
      'This is aaa.',
      '',
      '<%= partial("doc.md") %>',
    ].join('\n'));

    // load a partial
    template.partial('doc.md', [
      '### BBB',
      'This is bbb.',
      '',
      '#### CCC',
      'This is ccc.',
      '',
      '##### DDD',
      'This is ddd.',
    ].join('\n'));
  })

  it('should work as a preRender middleware:', function (done) {
    template.preRender(/\.md$/, toc(template));

    // render `./fixtures/basic.md`
    template.render('fixture.md', function (err, content) {
      if (err) console.log(err);

      content.should.equal([
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
        'This is ddd.'
      ].join('\n'));
      done();
    });
  });

  it('should work as a postRender middleware:', function (done) {
    template.postRender(/\.md$/, toc(template));

    // render `./fixtures/basic.md`
    template.render('fixture.md', function (err, content) {
      if (err) console.log(err);
      content.should.equal([
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
});
