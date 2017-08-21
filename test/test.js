/* global describe, it */

const assert = require('stream-assert')
const elm = require('node-elm-compiler')
const expect = require('chai').expect
const File = require('vinyl')
const fs = require('fs')
const path = require('path')

const elmExtractAssets = require('../')

const fixture = function() {
  return path.join(__dirname, 'fixture')
}

const src = function(glob) {
  return path.join(fixture(), 'src', glob)
}

describe('gulp-elm-extract-assets', function() {
  var stream

  beforeEach(function() {
    stream = elmExtractAssets({ cwd: fixture(), tag: 'AssetUrl' })
  })

  it('should work in buffer mode', function(done) {
    this.timeout(600000)

    function assertContents(index, file) {
      return assert.nth(index, function(dep) {
        expect(dep.contents).to.eql(fs.readFileSync(dep.path))
      })
    }

    elm
      .compileToString(src('Main.elm'), { cwd: fixture() })
      .then(function(main) {
        stream
          .pipe(assertContents(1))
          .pipe(assertContents(2))
          .pipe(assert.end(done))
        stream.write(
          new File({
            path: 'Main.elm',
            contents: Buffer(main),
          })
        )
        stream.end()
      })
      .catch(function(e) {
        console.log(e)
      })
  })

  it('should emit error on streamed file', done => {
    stream
      .once('error', function(err) {
        expect(err.message).to.eql(
          'gulp-elm-extract-assets: Streaming not supported'
        )
      })
      .pipe(assert.end(done))
    stream.write({
      isNull: function() {
        return false
      },
      isStream: function() {
        return true
      },
    })
    stream.end()
  })

  it('should ignore null files', function(done) {
    stream.pipe(assert.length(0)).pipe(assert.end(done))
    stream.write(new File())
    stream.end()
  })
})
