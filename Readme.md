# Schulshop

Das ist der Branch für die All-Inkl Version.

## Developing
Das Projekt ist mit 
* React (Frontend)
* Typescript (Backend)
<br/>

gemacht

## Build
Im Terminal
```sh
$ npm run build
```
ausführen. Dann entsteht ein Ordner `/build` mit einem
Production-Build.

## Deploying
Ein fertiger Build wird benötigt. <br/>
Die Ordner
* `/data`
* `/images`
* und der Inhalt von `/build`

mit FTP auf den Server verschieben.

## Produkte ändern
Im Ordner `/data` die JSON-Dateien anpassen.

## Produkte und Bundles
### Produkte bearbeiten
Beispiel:
```json
{
    "umschlag_rot": {
        "name": "Roter Umschlag",
        "description": "Ein roter Umschlag.",
        "image": "umschlag_rot.png",
        "price": 1200,
        "bundle_price": 1100,
        "created_at": "2018-01-01T00:00:00.000Z",
        "badges": [
            {
                "text": "Empfohlen",
                "color": "yellow"
            }
        ]
    }
}
```
* Alle Keys müssen vorhanden sein.
* `price` ist der Preis * 100 um Rechenfehler zu vermeiden. -> hier kostet der Umschlag also 12.00€
* `created_at` kann beliebiges ISO-Date sein, aber wenn es das wirklich Erstellungsdatum ist, wird ein `Neu`-Badge bei dem Produkt angezeigt. Das aktuelle ISO-Date kann man z.B. mit Node bekommen:
    * Terminal öffnen
    * `$ node `
    * Dann `> new Date()`
* `badges`-Array kann leer sein. [Hier mehr](https://github.com/tom-heidenreich/schulshop/Readme.md#Badges)

### Bundles bearbeiten
`bundles.json` und `class_bundles.json` haben den gleichen Aufbau.
Beispiel:
```json
{
    "klasse-5a": {
        "name": "Klasse 5a",
        "description": "Das Klassen paket von der 5a",
        "content": [
            {
                "id": "umschlag_rot",
                "quantity": 1
            },
            {
                "id": "umschlag_blau",
                "quantity": 1
            }
        ],
        "badges": [
            {
                "color": "green",
                "text": "nachhaltig"
            }
        ],
        "created_at": "2022-06-25T15:36:01.331Z"
    }
}
```
Funktioniert ähnlich wie `products.json`.
<br/>
`id` in `content` muss eine ID von einem Produkt von `products.json` sein.

# Badges
Diese Keys gibt es:
| Name | Type | Description |
|--|--|--|
| text`*` | `string` | Der Text, der angezeigt wird |
| variant | `"color" \| "gradient"` | Wie der Badge aussehen soll. Default: `color` |
| color | `string` | css-Color Name oder Hexcode |
| gradient | `Gradient` | Gradient für den Badge |

<br/>

Gradient
| Name | Type | Description |
| -- | -- | -- |
| from`*` | `string` | css-Color Name oder Hexcode |
| to`*` | `string` | css-Color Name oder Hexcode |
| deg | `number` | linear gradient deg |

`*` required
