const File = require('vinyl')
const fs = require('fs')
const glob = require('glob-promise')
const through = require('through2')
const path = require('path')

const PLUGIN = 'gulp-elm-extract-assets'

const defaults = {
  cwd: process.cwd(),
  tag: 'AssetUrl',
}

module.exports = function(options) {
  const transform = function(file, encode, callback) {
    if (file.isNull()) {
      return callback()
    }

    if (file.isStream()) {
      this.emit('error', new Error(`${PLUGIN}: Streaming not supported`))
      return callback()
    }

    const _this = this
    const opts = Object.assign({}, defaults, options)
    const regexp = new RegExp(`${opts.tag}\\('(.*)'\\)`, 'g')
    const assets = []
    String(file.contents).replace(regexp, function(match, asset) {
      assets.push(asset)
    })

    _this.push(file)

    Promise.all(
      assets.map(function(asset) {
        return new Promise(function(resolve, reject) {
          fs.readFile(path.join(opts.cwd, asset), function(err, contents) {
            if (err) {
              reject(err)
            } else {
              _this.push(
                new File({
                  cwd: file.cwd,
                  path: path.join(opts.cwd, asset),
                  contents,
                })
              )
              resolve()
            }
          })
        })
      })
    )
      .then(function() {
        callback()
      })
      .catch(function(e) {
        console.log(e)
        callback()
      })
  }

  return through.obj(transform)
}
