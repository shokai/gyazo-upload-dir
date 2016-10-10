import {watch} from 'chokidar'
import Gyazo from 'gyazo-api'
import {EventEmitter} from 'events'

export default class Uploader extends EventEmitter {
  constructor ({dir, accessToken}) {
    super()
    this.dir = dir
    this.gyazo = new Gyazo(accessToken)
    this.onAdd = this.onAdd.bind(this)
  }

  startWatch () {
    this.watcher = watch(this.dir, {
      ignoreInitial: true
    })
    this.watcher
      .on('add', this.onAdd)
      .on('error', err => this.emit('error', err))
  }

  onAdd (path, stat) {
    if (!(/\.(jpe?g|gif|png)$/i.test(path))) return
    setTimeout(() => this.onNewFile(path), 3000)
  }

  onNewFile (source) {
    this.emit('upload', source)
    this.gyazo
      .upload(source, {title: 'gyazo-upload-dir', desc: 'up'})
      .then(result => this.emit('success', {source, result}))
      .catch(err => this.emit('error', err))
  }
}
