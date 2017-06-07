#!/usr/bin/env node

'use strict'

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

const spec = process.argv.slice(2)
const focha = require('..')
focha({ spec: spec })
