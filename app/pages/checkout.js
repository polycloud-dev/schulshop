import styles from '../styles/Checkout.module.css'

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from "react";
import sessions from "../backend/sessions"

import Image from 'next/image';
import Head from 'next/head';

import {Button, Modal} from '@mantine/core'
import { publicKey } from '../backend/payment';

import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "../modules/stripeCheckout";

import {loadStripe} from "@stripe/stripe-js";

const URL = `http://${(process.env.PRODUCTION === 'TRUE' && process.env.URL ? process.env.URL : 'localhost:3000')}`

export default function Checkout({session, productsSession, publicKey}) {

    const [products, setProducts] = useState(productsSession);
    const [spamTimer, setSpamTimer] = useState();

    const [modalOpen, setModalOpen] = useState(false)

    const [clientSecret, setClientSecret] = useState();

    function parsePrice(price) {
        return (parseFloat(price)/100).toFixed(2);
    }

    function loadStripeCheckout() {
        fetch('/api/checkout/intent', {"method": "POST", "body": JSON.stringify({"products": products})})
            .then(res => res.json())
            .then(res => {
                setClientSecret(res['client-secret'])
                setModalOpen(true)
            })
    }

    useEffect(() => {
        setTimeout(() => {
            fetch(`/api/checkout/get`).then(res => {
                if(res.status !== 200) return window.location.href = `/error/database-timeout?from=/checkout`
                else return res.json().then(json => {
                    if(json.products) {
                        setProducts(json.products)
                        if(json.products.length === 0) setTimeout(() => {updateSession(); window.location.href = '/'}, 1000)
                    }
                })
            })
        }, 2000)
    }, [])

    function removeProduct(product) {
        toast('Vom Warenkorb entfernt!', {"theme": "dark", "icon": "🛒"});
        const a = products
        a.pop(product)
        setProducts(a)
        saveSession()
        window.scrollTo(0, document.getElementById("productContainer").scrollHeight);
        if(products.length === 0) setTimeout(() => {updateSession(); window.location.href = '/'}, 1000) 
    }

    function saveSession() {
        if(!session) return;
        clearTimeout(spamTimer)
        setSpamTimer(setTimeout(updateSession, 2000));
    }

    function updateSession() {
        fetch(`/api/checkout/update`, {
            "method": "PUT",
            "body": JSON.stringify({
                "products": products
            })
        }).then(res => {
            if(res.status !== 200) return window.location.href = `/error/database-timeout?from=/checkout`
        })
    }

    function calculateOrderAmount() {
        var all = 0;
        products.forEach(element => {
            all += element.price
        });
        return all;
    }

    return (
        <div className={styles.center}>
            <Head>
                <title>Checkout | Schulshop</title>
            </Head>
            <div className={styles.main}>
                <h2>Warenkorb | Kaufen</h2>
                <div className={styles.container} id='productContainer'>
                    {products.length == 0 ? <h2>Leer</h2> : null}
                    {products.map(product => {
                        return (
                            <div key={product.id + "" + Math.random()} className={styles.item}>
                                <img alt={`Bild von ${product.name}`} src={product.thumbnail} />
                                <p className={styles.name}>{product.name}</p>
                                <p className={styles.tag}>Preis: <span>{parsePrice(product.price)}€</span></p>
                                <img alt='Entfernen' className={styles.close} draggable={false} src='/icon/close.svg' onClick={() => removeProduct(product)}/>
                            </div>
                        )
                    })}
                    
                </div>
                <h4>Gesamt: {parsePrice(calculateOrderAmount())}€</h4>
                {clientSecret ? <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    hideCloseButton
                    centered
                    size='auto'
                >
                    <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
                        <Elements options={{clientSecret, "appearance": {"theme": "stripe"}}} stripe={loadStripe(publicKey)}>
                            <CheckoutForm returnUrl={`${URL}/success`}/>
                        </Elements>
                    </div>
                </Modal> : null}
                <Button style={{"marginTop": "auto"}} onClick={() => loadStripeCheckout()}>Kaufen</Button>
                <h4 onClick={() => {updateSession(); window.location.href = '/'}} className={styles.return}><div><Image draggable={false} src='/icon/return.svg' alt='return' height='100%' width='100%'/></div>zurück</h4>
            </div>
            <ToastContainer
                position="bottom-left"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={2}
            />
        </div>
    )
}

import LogClient from '../backend/logger';
const logClient = new LogClient('IndexPage');

export async function getServerSideProps(context) {
    const user = await new sessions.timedTask(() => {
        return sessions.login(context);
    }).start();
    if(!user.authenticated) return {"props": {}, "redirect": {"destination": `/login`, "permanent": false}}
    const session = await new sessions.timedTask(() => {
        return sessions.get(user.session)
    }).start();
    if(session instanceof Error) {
        if(session.id === 'timeout') return {"props": {}, "redirect": {"destination": `/error/database-timeout?from=/checkout`, "permanent": false}}
        else if(session.id === 'session-notfound') return {"props": {}, "redirect": {"destination": `/error/session-notfound?from=/checkout`, "permanent": false}}
        else {
            logClient.error(session);
            return {"props": {}, "redirect": {"destination": `/error/unknown?from=/checkout`, "permanent": false}}
        }
    }
    return {"props": {"session": user.session, "productsSession": session.products, "publicKey": publicKey}}
}