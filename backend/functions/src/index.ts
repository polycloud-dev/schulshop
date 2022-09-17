import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

import * as products_json from "../data/products.json";
import * as bundles_json from "../data/bundles.json";
import * as class_bundles_json from "../data/class_bundles.json";

dotenv.config({
    path: path.join(__dirname, '..', '..', '.env')
});

const app = express();
app.use(cors())

// serve product data
app.get("/products", (_, res) => {
    res.setHeader('Content-Type', 'application/json').json(products_json);
});
app.get("/bundles", (_, res) => {
    res.setHeader('Content-Type', 'application/json').json(bundles_json);
});
app.get("/class_bundles", (_, res) => {
    res.setHeader('Content-Type', 'application/json').json(class_bundles_json);
});

export const data = functions.https.onRequest(app);

// /order endpoint
export const order = functions.https.onRequest((req, res) => {

    try {
        // cors
        res.set('Access-Control-Allow-Origin', "*")
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', '*');
        if (req.method === "OPTIONS") {
            res.status(204).send('');
            return;
        }

        if (req.method !== 'POST') res.status(400).send('Bad Request');

        // extract data
        const { name, school_class, email, products } = req.body;

        let total_price = 0;

        if (!name) {
            res.status(400).json({ error: 'Name ist benötigt' })
            return
        }
        else if (!name.match(/^[a-zA-ZäöüÄÖÜß]+\s[a-zA-ZäöüÄÖÜß]+/)) {
            res.status(400).json({ value: name, error: 'Bitte geben Sie einen gültigen Namen ein.' })
            return
        }
        else if (name && name.length > 30) {
            res.status(400).json({ value: name, error: 'Der Name darf nicht länger als 30 Zeichen sein.' })
            return
        }

        // check if school class is valid
        // school class has to be a number between 1 and 12 and a character between a and z
        // example: 12a or 5b
        if (!school_class) {
            res.status(400).json({ error: 'Klasse ist benötigt' })
            return
        }
        else if (!school_class.match(/^[1-9][0-3]?[a-z]$/)) {
            res.status(400).json({ value: school_class, error: 'Bitte geben Sie eine gültige Klasse ein.' })
            return
        }

        // check if email is valid
        // example: mail@mail.com or 123@abc.xy
        if (email && !email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
            res.status(400).json({ value: email, error: 'Bitte geben Sie eine gültige Email-Adresse ein.' })
            return
        }

        // check if products are valid
        if (!products) {
            res.status(400).json({ error: 'Produkte sind benötigt' })
            return
        }
        else if (!Array.isArray(products)) {
            res.status(400).json({ value: products, error: 'Produkte sind ungültig.' })
            return
        }
        else if (products.length === 0) {
            res.status(400).json({ value: products, error: 'Es wurden keine Produkte ausgewählt.' })
            return
        }
        for (const product of products) {
            if (!product.type) {
                res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                return
            }
            else if (!product.id) {
                res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                return
            }
            else if (product.type === 'product') {
                if (!product.quantity || product.quantity < 1) {
                    res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                    return
                }
                // check if product exists
                // @ts-ignore
                const json_product = products_json[product.id]
                if (!json_product) {
                    res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                    return
                }else {
                    total_price += json_product.price * product.quantity;
                }
            }
            else if (product.type === 'bundle' || product.type === 'class_bundle') {
                // check if bundle exists
                // @ts-ignore
                const json_bundle = bundles_json[product.id]
                if (!json_bundle) {
                    // check if class bundle exists
                    // @ts-ignore
                    const json_class_bundle = class_bundles_json[product.id]
                    if (!json_class_bundle) {
                        res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                        return
                    }else {
                        total_price += json_class_bundle.price;
                    }
                }else {
                    total_price += json_bundle.price;
                }
            }
            else if (product.type === 'variant') {

                if (!product.quantity || product.quantity < 1) {
                    res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                    return
                } else {
                    // find product
                    // @ts-ignore
                    const found_product = products_json[product.id];
                    // check if product exists
                    if (!found_product) {
                        res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                        return;
                    }
                    // check if variant exists
                    if (!found_product.variants.find((v: any) => v.name === product.variant)) {
                        res.status(400).json({ value: product, error: 'Produkt ist ungültig.' })
                        return
                    }else {
                        total_price += found_product.price * product.quantity;
                    }
                }
            }else {
                res.status(400).json({ value: product, error: 'Unbekanntes Produkt.' })
                return
            }
        }

        // generate order id
        const order_id = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).substring(0, 4).toUpperCase();

        // generate session id
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const session_id = createHash('sha256').update(!ip || typeof ip !== 'string' ? 'unknown ip' : ip).digest('hex').substring(0, 16);

        const order = {
            ...req.body,
            order_id,
            session_id,
            total_price,
        }

        // send email
        if(!sendEmail(order)) {
            res.status(500).json({ error: 'Email konnte nicht versendet werden.' })
            return
        }

        functions.logger.log('successfull order', order);

        res.status(200).json({ success: true, order_id, total_price });

    } catch (error) {
        functions.logger.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

async function sendEmail(order: any) {
    try {
        const transporter = nodemailer.createTransport({
            // @ts-ignore
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // prepare html
        let html = fs.readFileSync(path.join(__dirname, '..', '..', 'email.html'), 'utf8');
        html = html.replace('%{name}', order.name);
        html = html.replace('%{school_class}', order.school_class);
        html = html.replace('%{email}', order.email || '<Keine Email-Adresse angegeben>');
        html = html.replace('%{order_id}', order.order_id);
        html = html.replace('%{session_id}', order.session_id);
        html = html.replace('%{total_price}', (order.total_price/100).toFixed(2) + '€');
        html = html.replace('%{products}', order.products.map((product: any) => {
            if (product.type === 'product') {
                // @ts-ignore
                return `<li>${product.quantity}x ${products_json[product.id].name}</li>`;
            }
            else if (product.type === 'bundle') {
                // @ts-ignore
                return `<li>${bundles_json[product.id] ? bundles_json[product.id].name : class_bundles_json[product.id].name + ' Paket'}</li>`;
            }
            else if (product.type === 'variant') {
                // @ts-ignore
                const found_product = products_json[product.id];
                return `<li>${product.quantity}x ${found_product.name} (${product.variant})</li>`;
            }
            else return ''
        }).join(''));

        const info = await transporter.sendMail({
            from: `"Schulshop" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Bestellung`,
            html
        });

        functions.logger.log('Message sent: %s', info.messageId);
        return true

    }catch(e) {
        functions.logger.error(e);
        return false
    }
}