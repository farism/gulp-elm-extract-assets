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
