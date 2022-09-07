import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

import * as products_json from "../data/products.json";
import * as bundles_json from "../data/bundles.json";
import * as class_bundles_json from "../data/class_bundles.json";

const app = express();
app.use(cors())

// serve product data
app.get("/products", (_, res) => {
    res.json(products_json);
});
app.get("/bundles", (_, res) => {
    res.json(bundles_json);
});
app.get("/class_bundles", (_, res) => {
    res.json(class_bundles_json);
});

export const data = functions.https.onRequest(app);

// /order endpoint
export const order = functions.https.onRequest((request, response) => {
    
    functions.logger.info(request.body, {structuredData: true});
    response.send("Hello from Firebase!");
});