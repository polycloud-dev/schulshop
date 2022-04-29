import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

import { useState, useEffect } from "react";

import styles from '../styles/Checkout.module.css'

export default function CheckoutForm({returnUrl}) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Zahlung erfolgreich abgeschlossen!");
                    break;
                case "processing":
                    setMessage("Ihre Zahlung wird verarbeitet.");
                    break;
                case "requires_payment_method":
                    setMessage("Ihre Zahlung war nicht erfolgreich, bitte versuchen Sie es erneut.");
                    break;
                default:
                    setMessage("Etwas ist schief gelaufen.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("Ein unerwarteter Fehler ist aufgetreten.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button className={styles.stripeButton} disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Zahlen"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}