const express = require('express');
const cors = require('cors')
const path = require('path');

const app = express();

const PORT = 3040

//cors
app.use(cors())

// serve images
app.use('/images', express.static(path.join(__dirname, '../images')));

// serve files
app.get('/data/bundles', (_, res) => {
    res.setHeader('Content-Type', 'application/json').sendFile(path.join(__dirname, '../data/bundles.json'));
})

app.get('/data/class_bundles', (_, res) => {
    res.setHeader('Content-Type', 'application/json').sendFile(path.join(__dirname, '../data/class_bundles.json'));
})

app.get('/data/products', (_, res) => {
    res.setHeader('Content-Type', 'application/json').sendFile(path.join(__dirname, '../data/products.json'));
})

// listen
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})