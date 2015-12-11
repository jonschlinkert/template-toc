# template-toc [![NPM version](https://img.shields.io/npm/v/template-toc.svg)](https://www.npmjs.com/package/template-toc) [![Build Status](https://img.shields.io/travis/s/template-toc.svg)](https://travis-ci.org/s/template-toc)

> Middleware for generating a markdown-formatted table of contents with Template, or Template-based applications

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i template-toc --save
```

## Table of Contents

_(Generated by [verb] using this middleware)_

<!-- toc -->


## Usage

```js
var toc = require('template-toc');
```

### Two Steps

**1. [Register the middleware](#usage-with-template)**

Register with [template], [verb], [assemble] or any other application that implements [template].


**2. Add a TOC marker**

Add the following to any markdown file that should get a Table of Contents:

```html
<!!-- toc -->
```

### Usage with Template

```js
var Template = require('template');
var template = new Template();
```

**Pre-render middleware**

If you want the TOC to be generated before layouts are used or partials are injected into pages, use the `.preRender()` method. 

```js
template.preRender(/\.md$/, toc(template));
```

This project's [verbfile](./.verb.md) is a good example. Verb uses this middleware with `.preRender()` so that the generated TOC only includes "top-level" headings that are in the template, and none of the headings from partials are includes.


**Post-render middleware**

If you want the TOC to be generated **after** layouts are used or partials are injected into pages, use the `.postRender()` method. 

```js
template.postRender(/\.md$/, toc(template));
```

**Rendering templates**

Once the middlware is setup, any templates with a `.md` extension and a `<!!-- toc -->` comment will have a TOC injected.

```js
template.render('README.md', function(err, content) {
  console.log(content);
});
```
Visit [template] for documentation.


### Usage with Verb

```js
var verb = require('verb');
verb.preRender(/\.md$/, toc(verb));
// or 
verb.postRender(/\.md$/, toc(verb));
```

Visit [verb] for documentation.

### Usage with Assemble

```js
var assemble = require('assemble');
assemble.preRender(/\.md$/, toc(assemble));
// or 
assemble.postRender(/\.md$/, toc(assemble));
```

Visit [assemble] for documentation.

## Pro-tip

**Escaping**

If, for some reason, you need to use the `<!- toc -->` comment in documentation and you do not want it to be rendered, just add an extra `!` after the first angle bracket, and the extra `!` will be removed but the TOC will not be rendered.

```html
<!!-- toc -->
```

## Related projects
* [markdown-toc](https://www.npmjs.com/package/markdown-toc): Generate a markdown TOC (table of contents) with Remarkable. | [homepage](https://github.com/jonschlinkert/markdown-toc)
* [markdown-utils](https://www.npmjs.com/package/markdown-utils): Micro-utils for creating markdown snippets. | [homepage](https://github.com/jonschlinkert/markdown-utils)
* [remarkable](https://www.npmjs.com/package/remarkable): Markdown parser, done right. 100% Commonmark support, extensions, syntax plugins, high speed - all in… [more](https://www.npmjs.com/package/remarkable) | [homepage](https://github.com/jonschlinkert/remarkable)
* [template](https://www.npmjs.com/package/template): Render templates using any engine. Supports, layouts, pages, partials and custom template types. Use template… [more](https://www.npmjs.com/package/template) | [homepage](https://github.com/jonschlinkert/template)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)  

## Running tests
Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/s/template-toc/issues/new).

## Author
**https://github.com/jonschlinkert**

+ [github/s](https://github.com/s)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright © 2015 [https://github.com/jonschlinkert](s)
Released under the MIT license.

***

_This file was generated by [verb](https://github.com/verbose/verb) on December 11, 2015._

[verb]: https://github.com/assemble/verb
[assemble]: https://github.com/assemble/assemble
[template]: https://github.com/jonschlinkert/template
