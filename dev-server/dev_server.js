const express = require('express');
const cors = require('cors')
const path = require('path');

const app = express();

const PORT = 3040

//cors
app.use(cors())

// serve images
app.use('/images', express.static(path.join(__dirname, '../images')));

// listen
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})