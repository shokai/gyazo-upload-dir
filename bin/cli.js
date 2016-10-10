#!/usr/bin/env node
require('babel-polyfill')
require('../lib/').start(process.argv.slice(2))
