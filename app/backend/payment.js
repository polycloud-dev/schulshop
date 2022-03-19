export const publicKey = process.env['STRIPE-PUBLIC'] ? process.env['STRIPE-PUBLIC'] : 'pk_test_51KSQXUA2VPB4CDA6cX4Q019WfMgzCK85fO7zdrWb7udPE5CAiGw1NNbJLh2Dwh8j89Luju4adyTl0IiARAwVAsdS00hqGISPm4'
const secretKey = process.env['STRIPE-SECRET'] ? process.env['STRIPE-SECRET'] : 'sk_test_51KSQXUA2VPB4CDA6jOt4CcpDnF5QgJ464c8IqNKMrNtosnX17iYkXaphePGUyo8h3dn3UtX0DW7XB732k3V3gAj400IxCAuCiv'

const stripe = require("stripe")(secretKey);

function calculateOrderAmount(products) {
    var all = 0;
    products.forEach(element => {
        all += element.price
    });
    return all;
}

export function confirmPayment(paymentIntent) {
    return new Promise(async resolve => {
        const response = await stripe.paymentIntents.retrieve(paymentIntent);
        return resolve(response)
    })
}

export function createIntent(items) {
    return new Promise(async resolve => {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            "amount": calculateOrderAmount(items),
            "currency": "eur",
            "automatic_payment_methods": {
                "enabled": true,
            },
        });

        resolve({"clientSecret": paymentIntent.client_secret})
    })
}