// @ts-check
const log = require('debug')('focha')
const la = require('lazy-ass')
const is = require('check-more-types')
const join = require('path').join
const {
  existsSync: exists,
  unlinkSync: rm,
  readFileSync: read,
  writeFileSync: write,
  mkdirSync: md
 } = require('fs')

const saveFolder = join(process.cwd(), '.focha')

const filename = join(saveFolder, '.focha.json')

const stringify = what => JSON.stringify(what, null, 2) + '\n\n'

function saveFailedTests ({tests, version}) {
  la(is.array(tests), 'expected a list of suites', tests)
  const json = stringify({tests, version})

  if (!exists(saveFolder)) {
    log('created output folder %s', saveFolder)
    md(saveFolder)
  }
  write(filename, json, 'utf8')
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

function recordTests ({tests, version}) {
  if (is.empty(tests.length)) {
    clearSavedOrder()
  } else {
    saveFailedTests({tests, version})
  }
  return Promise.resolve()
}

module.exports = {
  save: saveFailedTests,
  clear: clearSavedOrder,
  load: loadOrder,
  record: recordTests,
  filename: function () {
    return filename
  }
}
