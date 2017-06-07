const log = require('debug')('focha')
const la = require('lazy-ass')
const is = require('check-more-types')
const join = require('path').join
const filename = join(process.cwd(), '.focha.json')
const exists = require('fs').existsSync
const rm = require('fs').unlinkSync
const read = require('fs').readFileSync

function saveFailedTests (tests) {
  la(is.array(tests), 'expected a list of suites', tests)

  const json = JSON.stringify(tests, null, 2) + '\n\n'
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
  const json = read(filename)
  const order = JSON.parse(json)
  log('loaded order from', filename)
  return order
}

module.exports = {
  save: saveFailedTests,
  clear: clearSavedOrder,
  load: loadOrder,
  filename: function () {
    return filename
  }
}
