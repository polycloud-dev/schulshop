import Head from 'next/head'
import { confirmPayment } from '../backend/payment';

import styles from '../styles/Success.module.css'

// This page is rendered when the user has successfully paid
export default function Success({status, order_id}) {
    return (
        <div className={styles.app}>
            <Head>
                <title>Kauf | Schulshop</title>
            </Head>
            {
                status === 'succeeded' ?
                <>
                    <h1>Vielen Dank für Ihren Einkauf!</h1>
                    <h2>Ihre Bestellungsnummer: {order_id}</h2>
                    <h3>Die Bestellungsnummer ist notwendig, um die Bestellung abzuhohlen.</h3>
                </>
                : status === 'proccessing' ?
                <>
                    <h1>Ihre Bestellung wird noch bearbeitet</h1>
                </>
                : status === 'failed' ?
                <>
                    <h1>Ihre Bestellung konnte nicht verarbeitet werden</h1>
                </>
                : <h1>Unerwarter Fehler {status}</h1>
            }
        </div>
    )
}

import sessions from '../backend/sessions'
import LogClient from '../backend/logger';
const logClient = new LogClient('IndexPage');

export async function getServerSideProps(context) {

    
    const user = await new sessions.timedTask(() => {
        return sessions.login(context);
    }).start();
    if(!user.authenticated) return {"props": {}, "redirect": {"destination": `/login`, "permanent": false}}

    if(context.query['payment_intent'] && context.query['payment_intent_client_secret']) {
        const response = await confirmPayment(context.query['payment_intent']);
        if(response.error) console.log(response.error);

        if(response.status === 'succeeded') {
            const intent = await new sessions.timedTask(() => {
                return sessions.removeIntent(context)
            }).start();
            if(intent instanceof Error) {
                logClient.error(intent);
                return {"props": {}, "redirect": {"destination": `/error/unknown?from=/success`, "permanent": false}}
            }
        }

        return {"props": {}, "redirect": {"destination": `/success`, "permanent": false}}
    }

    const order_id = Math.floor(Math.random() * 8999 + 1000);
    const response = {
        "status": "succeeded"
    }

    return {"props": {"status": response.status, "order_id": order_id}}
}