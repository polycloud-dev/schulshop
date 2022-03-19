import Head from 'next/head'
import { confirmPayment } from '../../backend/payment';

export default function Success({status}) {
    return (
        <>
            <Head>
                <title>Kauf | Schulshop</title>
            </Head>
            <h1>{status === 'succeeded' ? "Gekauft!" : status}</h1>
            <h2>Nummer: 123</h2>
            <h4>Nummer benötigt, um Produkte in der Schule abzuholen!</h4>
        </>
    )
}

import sessions from '../../backend/sessions'

export async function getServerSideProps(context) {
    const sessionId = context.query.id;
    const paymentIntent = context.query['payment_intent']
    //const payment_intent_client_secret = context.query['payment_intent_client_secret']
    //const redirect_status = context.query['redirect_status']
    const user = await new sessions.timedTask(() => {
        return sessions.login(context.req.connection.remoteAddress);
    }).start();
    if(!user.authenticated) return {"props": {}, "redirect": {"destination": `/login`, "permanent": false}}
    const session = await new sessions.timedTask(() => {
        return sessions.get(sessionId)
    }).start();
    if(session instanceof Error) {
        if(session.id === 'timeout') return {"props": {}, "redirect": {"destination": `/error/database-timeout?from=/success/${sessionId}`, "permanent": false}}
        else if(session.id === 'session-notfound') return {"props": {}, "redirect": {"destination": `/error/session-notfound?from=/success/${sessionId}`, "permanent": false}}
        else {
            logClient.error(session);
            return {"props": {}, "redirect": {"destination": `/error/unknown?from=/success/${sessionId}`, "permanent": false}}
        }
    }
    const response = await confirmPayment(paymentIntent);
    if(response.error) console.log(response.error);
    return {"props": {"status": response.status}}
}