require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');

const HTML = fs.readFileSync('./email.html', 'utf8');

const app = express();
const PORT = 3050;

app.use(cors());
app.use(express.json());

app.post('/api/order', async (req, res) => {
    const { name, school_class, email, products } = req.body;

    // Check if all required fields are present
    if(!name) return res.status(400).json({error: 'Name is required'});
    else if(!name.match(/^[a-zA-ZäöüÄÖÜß]+\s[a-zA-ZäöüÄÖÜß]+/)) return res.status(400).send({error: 'Name is invalid'});
    else if(name && name.length > 30) return res.status(400).send({error: 'Name is too long'});

    if(!school_class) return res.status(400).send({error: 'School class is required'});
    else if(!school_class.match(/^[1-9][0-3]?[a-z]$/)) return res.status(400).send({error: 'School class is invalid'});

    if(email && !email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) return res.status(400).send({error: 'Email is invalid'});

    if(!products) return res.status(400).send({error: 'Products are required'});
    else if(!Array.isArray(products)) return res.status(400).send({error: 'Products are invalid'});

    products.forEach(product => {
        if(!typecheckProduct(product)) return res.status(400).send({error: 'Products are invalid'});
    })

    // get user id
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_id = crypto.createHash('md5').update(ip).digest('hex');

    // generate 6 digit random number (ist mies ineffizient, aber ich habe keinen anderen Weg gefunden)
    const random = Math.floor(Math.random() * 1000000);
    const order_id = random.toString().padStart(6, '0');

    console.log(`${user_id}: ${name} - ${school_class} - ${email}`);

    sendMail({ name, school_class, email, products, user_id })

    res.json({ success: true, order_id});
})

// EASTER EGG
app.get('/secret', (_, res) => {
    // SBVR(3
    const msg = '01010111 01100001 01110010 01110101 01101101 00100000 01110011 01100011 01101000 01101110 11000011 10111100 01100110 01100110 01100101 01101100 01110011 01110100 00100000 01100100 01110101 00100000 01100100 01100101 01101110 01101110 00100000 01101000 01101001 01100101 01110010 00100000 01110011 01101111 00100000 01110010 01110101 01101101 00111111 00111111 00100000 01001010 01100101 01110100 01111010 01110100 00100000 01100111 01100101 01101000 00100000 01110111 01101001 01100101 01100100 01100101 01110010 00100000 01111010 01110101 01110010 11000011 10111100 01100011 01101011 00100000 01111010 01110101 01101101 00100000 01010011 01101000 01101111 01110000 00100001 00100000 01000001 01100010 01100101 01110010 00100000 01111010 01110101 01101101 00100000 01000111 01101100 11000011 10111100 01100011 01101011 00100000 01101000 01100001 01110011 01110100 00100000 01100100 01110101 00100000 01101110 01101111 01100011 01101000 00100000 01101110 01101001 01100011 01101000 01110100 00100000 01100001 01101100 01101100 01100101 00100000 01010011 01100101 01100011 01110010 01100101 01110100 01110011 00100000 01100111 01100101 01100110 01110101 01101110 01100100 01100101 01101110 00101110 00001010 00001010 00001010 00001010 00001010 01001000 01101001 01100101 01110010 00100000 01101001 01110011 01110100 00100000 01100101 01101001 01101110 00100000 01001000 01101001 01101110 01110111 01100101 01101001 01110011 00111010 00100000 01010011 01000010 01010110 01010010 00101000 00110011'
    res.setHeader('Content-Type', 'text/html');
    res.write(`<html style="background-color:black;"><div style="color:green;">${msg}</div></html>`);
    res.end();
})
// ENDE EASTER EGG

app.get('/', (_, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.write('<h1>Forbidden</h1><p style="display:none" >/secret</p>')
    res.end()
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

function sendMail(props) {
    return new Promise(resolve => {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const html = generateHTML(props);

        const mailOptions = {
            from: `"Bestellung" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            subject: 'Bestellung 📄',
            html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    })
}

function generateHTML({ name, school_class, email, products, user_id}) {
    const html = HTML.replace('$NAME', name)
        .replace('$SCHOOL_CLASS', school_class)
        .replace('$EMAIL', email)
        .replace('$USER_ID', user_id)
        .replace('$PRODUCTS', products.map(product => `<li><b>ID:</b>${product.id}<br><b>Anzahl:</b>${product.quantity}<br/></li>`).join(''))
    return html;
}

function typecheckProduct(product) {
    if(!product.id) return false;
    if(typeof product.id !== 'string') return false;
    if(!product.quantity) return false;
    if(typeof product.quantity !== 'number') return false;
    return true;
}