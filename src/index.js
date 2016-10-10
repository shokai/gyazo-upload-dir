import minimist from 'minimist'
import Uploader from './uploader'
import {wait} from './util'
import pkg from '../package.json'

export function start (_argv) {
  const argv = minimist(_argv, {
    boolean: [ 'help' ],
    string: [ 'dir' ],
    alias: {
      'help': 'h',
      'dir': 'd'
    }
  });
  if (argv.help) {
    console.log(banner)
  }
  if (typeof argv.dir !== 'string' || !argv.dir) {
    console.error('--dir is missing')
    process.exit(1)
  }

  const dir = argv['dir']
  console.log('watch', dir)
  const accessToken = process.env.GYAZO_ACCESS_TOKEN
  const uploader = new Uploader({dir, accessToken})
  uploader.startWatch()
  uploader.on('error', err => console.error(err.stack || err))
  uploader.on('upload', source => console.log(`upload\t${source}`))
  uploader.on('success', ({source, result}) => {
    console.log(`success\t${result.data.permalink_url}`)
  })
  wait()
}

const banner = `${pkg.name} v${pkg.version} - ${pkg.homepage}

Usage:
  % ${pkg.name} --dir ~/Dropbox/

Options:
  --help   show help
  --dir    set directory
`
