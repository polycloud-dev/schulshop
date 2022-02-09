const fs = require('fs');
const express = require('express');
const {LogClient} = require('./logger')

const PORT = 3000
const PATH = './data.json'

const app = express()
const logClient = LogClient.register('Database');

//app.use(express.json())

app.get('/', (req, res) => {
    try {
        const json = JSON.parse(fs.readFileSync(PATH))
        logClient.log(`'${req.headers.host}' fetched data!`)
        res.json(json);
    }catch(e) {
        logClient.error(e)
        res.status(500).send(JSON.stringify(e)).end()
    }
})

app.get('/:key', (req, res) => {
    const key = req.params.key;
    try {
        const json = JSON.parse(fs.readFileSync(PATH))[key]
        logClient.log(`'${req.headers.host}' fetched data! key: '${key}'`)
        res.json(json);
    }catch(e) {
        logClient.error(e)
        res.status(500).send(JSON.stringify(e)).end()
    }
})

// app.post('/:key', (req, res) => {
//     const key = req.params.key;
//     const data = req.body;
//     try {
//         const json = JSON.parse(fs.readFileSync(PATH))
//         json[key] = data
//         fs.writeFileSync(PATH, JSON.stringify(json))
//         res.status(200).end()
//     }catch(e) {
//         console.log(`\x1b[31m${e}\x1b[0m`);
//         res.status(500).send(JSON.stringify(e)).end()
//     }
// })

app.listen(PORT, () => logClient.log(`started server on http://localhost:${PORT}`))