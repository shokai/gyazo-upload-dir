#!/usr/bin/env node
require('babel-polyfill')
var main = require('../lib/main')

main.start(process.argv.slice(2))
