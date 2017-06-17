// @ts-check
const log = require('debug')('focha')
const la = require('lazy-ass')
const is = require('check-more-types')
const join = require('path').join
const filename = join(process.cwd(), '.focha.json')
const exists = require('fs').existsSync
const rm = require('fs').unlinkSync
const read = require('fs').readFileSync

const stringify = what => JSON.stringify(what, null, 2) + '\n\n'

function saveFailedTests ({tests, version}) {
  la(is.array(tests), 'expected a list of suites', tests)
  const json = stringify({tests, version})
  const save = require('fs').writeFileSync
  save(filename, json)
  log('saved failed tests to file', filename)
  return filename
}

function clearSavedOrder () {
  if (exists(filename)) {
    rm(filename)
    log('tests have passed, deleted the current random order', filename)
  }
  return filename
}

function loadOrder () {
  if (!exists(filename)) {
    return
  }
  const json = read(filename, 'utf8')
  const order = JSON.parse(json)
  log('loaded order from', filename)
  if (order.version) {
    log('filed was saved using version %s', order.version)
  }
  return order.tests
}

module.exports = {
  save: saveFailedTests,
  clear: clearSavedOrder,
  load: loadOrder,
  filename: function () {
    return filename
  }
}
