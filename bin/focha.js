#!/usr/bin/env node

'use strict'

const minimist = require('minimist')
const join = require('path').join

const help = [
  'USE: focha <spec file pattern>',
  '     focha *-spec.js',
  '     focha spec/my-test-file.js'
].join('\n')

require('simple-bin-help')({
  minArguments: 3,
  packagePath: join(__dirname, '..', 'package.json'),
  help: help
})

// console.log(process.argv)

const argv = minimist(process.argv.slice(2), {
  boolean: ['all']
})
const spec = argv._
const focha = require('..')
focha({
  all: argv.all,
  spec: spec
})
