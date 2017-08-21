# gulp-elm-extract-assets [![Circle CI](https://circleci.com/gh/farism/gulp-elm-extract-assets/tree/master.svg?style=svg)](https://circleci.com/gh/farism/gulp-elm-extract-assets/tree/master)

Given an compiled `.elm` file and a `tag`, this plugin will extract all assets using that `tag`. A vinyl object will be emitted for each extracted asset. Inspired by [elm-asset-path](https://github.com/NoRedInk/elm-asset-path) but trying to avoid the native requirement.

#### Usage

```js
const elmExtractAssets = require('gulp-elm-extract-assets')

gulp.src('main.js')
  .pipe(elmExtractAssets({ tag: 'AssetUrl' }))
```

#### Options
```js
options = {
  tag // (required) asset tag
  cwd: process.cwd() // (optional) the root directory of your elm project
}
```

#### Example

on the elm side

```elm
-- Main.elm

module Main exposing (..)

import Html exposing (Html, div)
import Html.Attributes exposing (id, src)
import Assets exposing (url, elmLogo, css3Logo)


main : Html a
main =
    div []
        [ Html.img [ src (url elmLogo) ] []
        , Html.img [ src (url css3Logo) ] []
        ]

```
```elm
-- Assets.elm
module Assets exposing (..)


type Asset
    = AssetUrl String


url : Asset -> String
url asset =
    case asset of
        AssetUrl url ->
            url


elmLogo =
    AssetUrl "/src/elm.png"


css3Logo =
    AssetUrl "/src/css3.png"
```

on the gulp side

```js
const elm = require('gulp-elm')
const elmExtractAssets = require('gulp-elm-extract-assets')

gulp.task('build', () => {
  return gulp.src('Main.elm')
    .pipe(elm())
    .pipe(elmExtractAssets({ tag: 'AssetUrl '}))
    .pipe(imagemin())
    .pipe(revAll())
    .pipe(gulp.dest('build'))
})
```
