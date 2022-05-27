import LogClient from '../backend/logger';
const logClient = new LogClient('Database-Client')

const fetch = require('node-fetch');

const production = process.env['PRODUCTION'] === 'TRUE';

const minutes = 10;

var buffered = {};
var lastBuffered;

function buffer() {
    return new Promise(async resolve => {
        try {
            const res = await fetch('http://database:3000/');
            if(!res) {
                logClient.error(`cannot connect to database!`);
                setTimeout(buffer, 1000)
                return resolve();
            }
            logClient.log('buffering database!')
            const json = await res.json()
            buffered = json
            lastBuffered = new Date()
            resolve(json);
        }catch(e) {
            logClient.error(`cannot connect to database!`);
            setTimeout(buffer, 1000)
            return resolve();
        }
    })
}
if(production) buffer();

export default function dbGet(key) {
    if(!production) return devItems()[key];
    return new Promise(async resolve => {
        const expired = lastBuffered ? new Date(lastBuffered.getTime()) : undefined
        if(expired) expired.setMinutes(expired.getMinutes() + minutes)
        if(!expired || expired.getTime() <= new Date().getTime()) await buffer()
        return resolve(buffered[key])
    })
};

function devItems() {
    return {
        "products": [
            {
                "id": "heft-liniert-rand",
                "name": "A4 Heft liniert mit Rand",
                "thumbnail": "/content/thumbnail/82b2074f-1288-4b5d-8ae7-4f90b3a47933.png",
                "price": 1299
            },
            {
                "id": "heft-liniert",
                "name": "A4 Heft liniert ohne Rand",
                "thumbnail": "/content/thumbnail/82b2074f-1288-4b5d-8ae7-4f90b3a47933.png",
                "price": 1299
            },
            {
                "id": "heft-kariert-rand",
                "name": "A4 Heft kariert mit Rand",
                "thumbnail": "/content/thumbnail/d6b75482-6a9c-4348-9269-ed28ab2fca9f.png",
                "price": 1299
            },
            {
                "id": "heft-kariert",
                "name": "A4 Heft kariert ohne Rand",
                "thumbnail": "/content/thumbnail/d6b75482-6a9c-4348-9269-ed28ab2fca9f.png",
                "price": 1299
            },
            {
                "id": "umschlag-blau",
                "name": "Blauer Umschlag A4",
                "thumbnail": "/content/thumbnail/695c8eac-dfc8-4d80-bd3f-5148aabbb60f.png",
                "price": 50
            },
            {
                "id": "umschlag-rosa",
                "name": "Rosa Umschlag A4",
                "thumbnail": "/content/thumbnail/8bb4dae9-a344-47f7-8d76-c3fc486a9732.png",
                "price": 50
            },
            {
                "id": "umschlag-gruen",
                "name": "Grüner Umschlag A4",
                "thumbnail": "/content/thumbnail/1f1abda5-d5b0-4ea5-82dc-78e6ee489249.png",
                "price": 50
            },
            {
                "id": "umschlag-gelb",
                "name": "Gelber Umschlag A4",
                "thumbnail": "/content/thumbnail/b0000211-9c22-4e7b-a15b-e56d31f31865.png",
                "price": 50
            },
            {
                "id": "umschlag-lila",
                "name": "Lila Umschlag A4",
                "thumbnail": "/content/thumbnail/b0000211-9c22-4e7b-a15b-e56d31f31865.png",
                "price": 50
            }
        ],
        "bundles": [
            {
                "id": "bundle-1",
                "name": "Klasse 6f",
                "thumbnail": "/content/thumbnail/bundle-1.png",
                "content": {
                    "Mathe": [
                        "heft-kariert-rand",
                        "heft-kariert-rand",
                        "umschlag-blau",
                        "umschlag-blau"
                    ],
                    "Deutsch": [
                        "heft-liniert-rand",
                        "heft-liniert-rand",
                        "umschlag-rosa",
                        "umschlag-rosa"
                    ],
                    "Englisch": [
                        "heft-liniert-rand",
                        "heft-liniert-rand",
                        "umschlag-gruen",
                        "umschlag-gruen"
                    ],
                    "Wirtschaft": [
                        "heft-kariert-rand",
                        "umschlag-rosa"
                    ],
                    "Musik": [
                        "heft-kariert-rand",
                        "umschlag-gelb"
                    ],
                    "Chemie": [
                        "heft-kariert-rand",
                        "umschlag-lila"
                    ]
                }
            }
        ]
    }
}