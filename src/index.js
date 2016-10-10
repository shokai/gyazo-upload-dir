import minimist from 'minimist'
import Uploader from './uploader'
import {wait} from './util'
import pkg from '../package.json'

export function start (_argv) {
  const argv = minimist(_argv, {
    boolean: [ 'help' ],
    alias: {
      'help': 'h',
      'watch': 'w'
    }
  })
  if (argv.help) {
    console.log(banner)
    process.exit(0)
  }
  if (typeof argv.watch !== 'string' && !(argv.watch instanceof Array)) {
    console.error(banner)
    process.exit(1)
  }
  const dirs = argv.watch instanceof Array ? argv.watch : [argv.watch]
  console.log('watch', dirs)
  if (!process.env.GYAZO_ACCESS_TOKEN) {
    console.error('GYAZO_ACCESS_TOKEN is missing')
    process.exit(1)
  }
  for (let dir of dirs) {
    const uploader = new Uploader({
      dir,
      accessToken: process.env.GYAZO_ACCESS_TOKEN
    })
    uploader.startWatch()
    uploader.on('error', err => console.error(err.stack || err))
    uploader.on('upload', source => console.log(`upload\t${source}`))
    uploader.on('success', ({source, result}) => {
      console.log(`success\t${result.data.permalink_url}`)
    })
  }
  wait()
}

const banner = `${pkg.name} v${pkg.version} - ${pkg.homepage}

Usage:
  % ${pkg.name} --watch ~/Dropbox/ --watch ~/Pictures/

Options:
  --help   show help
  --watch  directory to watch
`
