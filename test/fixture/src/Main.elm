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
