const got = require('got')
const log = require('debug')('focha')
const la = require('lazy-ass')
const is = require('check-more-types')
const { concat } = require('urlconcat')
const {prop} = require('ramda')

function initService (url, apiKey, project, run) {
  la(is.url(url), 'invalid service url', url)

  const testResource = `/tests/${apiKey}/${project}/${run}`
  const fullUrl = (point) =>
    concat(url, point)

  const record = ({tests, version}) => {
    const postUrl = fullUrl(testResource)
    const body = {tests, version}
    log('recording tests at %s', postUrl)
    return got.post(postUrl, {json: true, body})
  }

  const load = () => {
    const getUrl = fullUrl(testResource)
    return got(getUrl, {json: true}).then(prop('body')).then(prop('tests'))
  }

  return {
    load,
    record
  }
}

module.exports = initService
