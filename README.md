# focha

> Mocha wrapper that runs previously failed tests first
> **F**ailing m**ocha** = Focha

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
[![next-update-travis badge][nut-badge]][nut-readme]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save-dev focha
```

## Use

Avoid running all tests just to check if previously failed tests are fixed.
If tests fail, `focha` saves file `.focha/.focha.json`.
On the next run, `focha` will only run tests listed in this file.
Thus the best strategy is to let `focha`
run failing tests and then, if it succeeds let it run all the tests.

You can do this by running it twice. From your CI file execute the second
command using `&&` and pass `--all` flag to run all the tests.

```sh
$(npm bin)/focha src/*-spec.js && $(npm bin)/focha --all src/*-spec.js
```

or simple use NPM script in `package.json`

```json
{
  "scripts": "focha src/*-spec.js && focha --all src/*-spec.js"
}
```

If the first command finds nothing, or failing tests pass, the second command
will run all the tests. If the failing tests are still failing, the second
command will not execute.

## Service

Instead of local JSON file, `focha` can save and load failed tests in a REST API,
just pass the end point via `SERVER` variable. Example service implementation
[bahmutov/test-results-server](https://github.com/bahmutov/test-results-server).

## Debug

Run with `DEBUG=focha` environment variable

## Example

See example project [focha-test](https://github.com/bahmutov/focha-test) with its test history

* [.travis.yml](https://github.com/bahmutov/focha-test/blob/master/.travis.yml) shows how tests are setup
* [TravisCI build history](https://travis-ci.org/bahmutov/focha-test/builds) where you can see 
  - a failing test run [#4](https://travis-ci.org/bahmutov/focha-test/builds/244777337)
  - the next run [#5](https://travis-ci.org/bahmutov/focha-test/builds/244784772) just executes the single failing test first
  - the run [#6](https://travis-ci.org/bahmutov/focha-test/builds/244786471) has the problem fixed and runs failing test and then all tests

## Related

* [rocha](https://github.com/bahmutov/rocha) - randomizes tests in Mocha
  to find inter-test dependencies

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/focha/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/focha.svg?downloads=true
[npm-url]: https://npmjs.org/package/focha
[ci-image]: https://travis-ci.org/bahmutov/focha.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/focha
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[nut-badge]: https://img.shields.io/badge/next--update--travis-weekly-green.svg
[nut-readme]: https://github.com/bahmutov/next-update-travis#readme
