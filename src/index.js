const Mocha = require('mocha')
const mocha = new Mocha()
const log = require('debug')('focha')
// verbose output during e2e tests
// const e2e = require('debug')('focha:e2e')
const la = require('lazy-ass')
const is = require('check-more-types')
const {Maybe} = require('ramda-fantasy')
const {prop} = require('ramda')
const pluralize = require('pluralize')

const order = require('./order-of-tests')

// Cache determines where failed test information is stored
// could be local file or external service
let cache

if (process.env.SERVER) {
  // load / save to service url
  const apiKey = process.env.API_KEY
  la(apiKey, 'invalid API_KEY')
  const projectName = 'test project'
  const runId = 'latest' // could be branch name?
  cache = require('./service-cache')(process.env.SERVER,
    apiKey, projectName, runId)
} else {
  // load / save to local file
  cache = require('./order-cache')
}
la(is.object(cache), 'missing test order object')

const {join} = require('path')
const pkg = require(join(__dirname, '../package.json'))

function focha (options) {
  options = options || {}

  log('starting focha with options %j', options)

  var specFilenames = options.spec
  if (!specFilenames) {
    console.error('Missing spec file pattern')
    process.exit(-1)
  }

  if (typeof specFilenames === 'string') {
    specFilenames = [specFilenames]
  }

  (options.all ? Promise.resolve(undefined) : cache.load())
  .then(prevFailingTests => {
    if (!prevFailingTests && !options.all) {
      console.log('😃 no previously failing tests found')
      console.log('ℹ️ run all tests using --all flag')
      return
    }

    const failedTests = []

    specFilenames.forEach(mocha.addFile.bind(mocha))

    const wasRunningJustFailingTests = () =>
      Maybe.toMaybe(is.unemptyArray(prevFailingTests)
        ? prevFailingTests : undefined)
    const numberOfPreviouslyFailingTests = () =>
      wasRunningJustFailingTests().map(prop('length'))

    if (prevFailingTests) {
      la(is.array(prevFailingTests), 'expected list of failing tests', prevFailingTests)

      mocha.suite.beforeAll(function () {
        la(prevFailingTests, 'missing failing tests')
        log('leaving only failed tests from last run')
        order.leave(prevFailingTests)(mocha.suite)

        // the order might be out of date if any tests
        // were added or deleted, thus
        // always collect the order
        // const testNames = order.collect(mocha.suite)
        // cache.save(testNames)
      })
    }

    function printFinishedMessage (failures) {
      if (failures === 0) {
        log('there were no failures in this run')
        numberOfPreviouslyFailingTests()
            .map(n => {
              console.log('🤔 previously %s failed', pluralize('test', n, true))
              console.log('✅ now everything is fine')
            })
      } else {
        if (is.not.empty(failedTests)) {
          console.log('%d failed tests', failedTests.length)
          console.log(failedTests)
          console.error('If you run Focha again, failed tests will run first')
        } else {
          console.error('Problem: Mocha has finished with an error')
          console.error('but we have no failed tests recorded! 🐞')
        }
      }
    }

    function mochaFinished (failures) {
      log('mocha run finished with %s', pluralize('failure', failures, true))

      la(failedTests.length === failures, 'wrong number of failures',
        failures, 'but we only have', failedTests.length, 'failed tests')
      cache.record({
        tests: failedTests,
        version: pkg.version
      }).then(function () {
        printFinishedMessage(failures)
        process.exit(failures)
      })
    }

    const runner = mocha.run(mochaFinished)

    runner.on('fail', function (test, err) {
      const failed = {
        title: test.title,
        fullTitle: test.fullTitle()
      }
      log('failed test "%s"', failed.fullTitle)
      failedTests.push(failed)
    })
  })
}

module.exports = focha
