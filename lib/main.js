import minimist from 'minimist'
import Uploader from './uploader'
import {wait} from './util'

export function start (argv) {
  argv = minimist(argv)
  const dir = argv['dir'] || argv['d'] || process.env.HOME
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
