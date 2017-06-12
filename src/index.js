const Mocha = require('mocha')
const mocha = new Mocha()
const log = require('debug')('focha')
// verbose output during e2e tests
// const e2e = require('debug')('focha:e2e')
const la = require('lazy-ass')
const is = require('check-more-types')
const chalk = require('chalk')

const order = require('./order-of-tests')
const cache = require('./order-cache')
la(is.object(cache), 'missing test order object')

function focha (options) {
  options = options || {}

  log('starting focha with options')
  log(JSON.stringify(options, null, 2))

  var specFilenames = options.spec
  if (!specFilenames) {
    console.error('Missing spec file pattern')
    process.exit(-1)
  }

  if (typeof specFilenames === 'string') {
    specFilenames = [specFilenames]
  }

  const failedTests = []

  specFilenames.forEach(mocha.addFile.bind(mocha))

  mocha.suite.beforeAll(function () {
    const failedLastTime = cache.load()
    if (failedLastTime) {
      log('leaving only failed tests from last run')
      order.leave(failedLastTime)(mocha.suite)
    } else {
      log('running all tests')
      // const randomOrder = order.shuffle(mocha.suite)
      // const names = order.collect(randomOrder)
      // e2e('shuffled names:')
      // e2e('%j', names)
    }

    // the order might be out of date if any tests
    // were added or deleted, thus
    // always collect the order
    // const testNames = order.collect(mocha.suite)
    // cache.save(testNames)
  })

  const runner = mocha.run(function (failures) {
    process.on('exit', function () {
      if (failures === 0) {
        cache.clear()
      } else {
        if (is.not.empty(failedTests)) {
          console.log('%d failed tests', failedTests.length)
          console.log(failedTests)
          const filename = cache.filename()
          la(is.unemptyString(filename), 'missing save filename')
          cache.save(failedTests)
          console.error('Failed tests order saved in', chalk.yellow(filename))
          console.error('If you run Focha again, failed tests will run first')
        } else {
          console.error('Problem: Mocha has finished with an error')
          console.error('but we have no failed tests recorded! 🐞')
        }
      }
      process.exit(failures)
    })
  })

  runner.on('fail', function (test, err) {
    let parent = test.parent
    // from top describe to describe containing the test
    let location = []
    while (parent) {
      location.push(parent.title)
      parent = parent.parent
    }
    location = location.reverse()

    failedTests.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      location
    })
  })
}

module.exports = focha
