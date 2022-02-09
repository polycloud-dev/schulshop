import styles from '../styles/Home.module.css'
import stylesCheckout from '../styles/Checkout.module.css'

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from '../modules/searchbar'
import PopupMenu from '../modules/popup_menu'
import ShoppingCart from "../modules/shopping_cart"

import { useState } from 'react';

export default function Home({preloadedItems, preloadedProducts, sessionId}) {

    const [products, setProducts] = useState(preloadedProducts);

    const [spamTimer, setSpamTimer] = useState();

    function addProduct(product) {
        toast('Zum Warenkorb hinzugefügt!', {"theme": "dark", "icon": "🛒"});
        const a = products
        a.push(product)
        setProducts(a)
        saveSession()
    }

    function removeProduct(product) {
        toast('Vom Warenkorb entfernt!', {"theme": "dark", "icon": "🛒"});
        const a = products
        a.pop(product)
        setProducts(a)
        saveSession()
    }

    function saveSession() {
        if(!sessionId) return;
        clearTimeout(spamTimer)
        setSpamTimer(setTimeout(updateSession, 2000));
    }

    function updateSession() {
        fetch(`/api/checkout/update/${sessionId}`, {
            "method": "PUT",
            "body": JSON.stringify({
                "products": products
            })
        }).then(res => {
            if(res.status !== 200) return window.location.href = '/error/database-timeout'
        })
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Home | Schulshop</title>
            </Head>
            <div className={styles.header}>
                <div className={styles.menuContainer}>
                    <PopupMenu atElement={false} style={{"width": "20rem", "display": "flex", "flexDirection": "column", "alignItems": "center", "borderRadius": "1rem", "borderWidth": "2px", "boxShadow": "3px 3px 18px 1px rgba(0, 0, 0, 0.3)"}}>
                        <ShoppingCart style={{"height": "3rem", "width": "3rem"}} index={products.length} id='icon'/>
                        <h3>Warenkorb</h3>
                        <div className={styles.container}>
                            {products.length > 0 ? products.map(product => {
                                return (
                                    <div key={product.id + "" + Math.random()} className={stylesCheckout.item}>
                                        <img alt={`Bild von ${product.name}`} src={product.thumbnail} className={stylesCheckout.smallThumbnail}/>
                                        <p className={stylesCheckout.name}>{product.name}</p>
                                        <p className={stylesCheckout.tag}>Preis: <span>{product.price}€</span></p>
                                        <img alt='Entfernen' className={stylesCheckout.close} draggable={false} src='/icon/close.svg' onClick={() => removeProduct(product)}/>
                                    </div>
                                )
                            }) : <p>leer</p>}
                        </div>
                        {products.length > 0 ? <Link onClick={updateSession} href={`/checkout/${sessionId}`}><a><h3 className={styles.buy}>Kaufen</h3></a></Link>
                        : <h3 className={styles.buy + " " + styles.buyBlocked}>Kaufen</h3>}
                    </PopupMenu>
                    <PopupMenu atElement={false} style={{"borderRadius": "1rem", "borderWidth": "2px", "boxShadow": "3px 3px 18px 1px rgba(0, 0, 0, 0.3)"}}>
                        <a>Hier</a>
                        <a>kann</a>
                        <a>ihre</a>
                        <a>Werbung</a>
                        <a>stehen!</a>
                    </PopupMenu>
                </div>
                <h1 onClick={() => setTimeout(() => window.open('https://asg-er.de', '_blank').focus(), 600)} className={styles.title}>ASG Schulshop</h1>
                <Searchbar className={styles.searchbar}/>
            </div>
            <div className={styles.gridContainer}>
                <div className={styles.grid}>{preloadedItems.map(element => {
                    return (
                        <div className={styles.item} key={element.id}>
                            <h3 className={styles.name}>{element.name}</h3>
                            <Image src={element.thumbnail} width='200%' height='200%' alt={element.name}/>
                            <div className={styles.itemFooter}>
                                <p>{element.price}€</p>
                                <img alt='Einkaufswagen' draggable={false} src='/icon/shopping_cart.svg' onClick={() => addProduct(element)}/>
                            </div>
                        </div>
                    )
                })}</div>
            </div>
            <div className={styles.footer}></div>
            <ToastContainer
                position="bottom-left"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={6}
            />
        </div>
    )
}
    
import dbGet from '../database/index'
import sessions from '../backend/sessions';
import LogClient from '../backend/logger';
const logClient = new LogClient('IndexPage');

export async function getServerSideProps(context) {
    const data = await dbGet('products')
    if(!data) return {"props": {}, "redirect": {"destination": `/error/database-timeout`, "permanent": false}}
    
    const user = await new sessions.timedTask(() => {
        return sessions.login(context.req.connection.remoteAddress);
    }).start();
    if(!user.authenticated) return {"props": {}, "redirect": {"destination": `/login`, "permanent": false}}
    const session = await new sessions.timedTask(() => {
        return sessions.create(context.req.connection.remoteAddress);
    }).start();
    if(session instanceof Error) {
        if(session.id === 'timeout') return {"props": {}, "redirect": {"destination": `/error/database-timeout`, "permanent": false}}
        else {
            logClient.error(session);
            return {"props": {}, "redirect": {"destination": `/error/unknown`, "permanent": false}}
        }
    }
    return {"props": {"preloadedItems": data, "preloadedProducts": session.products, "sessionId": session.sessionId}}
}