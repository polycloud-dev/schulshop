import styles from '../styles/Home.module.css'
import stylesCheckout from '../styles/Checkout.module.css'

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from '../modules/searchbar'
import ShoppingCart from "../modules/shopping_cart"

import { useState } from 'react';

import { Drawer, Menu } from '@mantine/core';

export default function Home({preloadedItems, preloadedProducts, sessionId}) {

    const [cartOpen, setCartOpen] = useState(false);

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

    function parsePrice(price) {
        return (parseFloat(price)/100).toFixed(2);
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Home | Schulshop</title>
            </Head>
            <div className={styles.header}>
                <div className={styles.menuContainer}>
                    {/* style={{"height": "3rem", "width": "3rem"}} */}
                    <div onClick={() => setCartOpen(true)}><ShoppingCart className={styles.menuItem} index={products.length} id='icon'/></div>
                    <Drawer
                        opened={cartOpen}
                        onClose={() => setCartOpen(false)}
                        padding="xl"
                        size="md"
                        position='right'
                        noScrollLock
                        hideCloseButton
                    >
                        <h3>Warenkorb</h3>
                        <div className={styles.container}>
                            {products.length > 0 ? products.map(product => {
                                return (
                                    <div key={product.id + "" + Math.random()} className={stylesCheckout.item}>
                                        <img alt={`Bild von ${product.name}`} src={product.thumbnail} className={stylesCheckout.smallThumbnail}/>
                                        <p className={stylesCheckout.name}>{product.name}</p>
                                        <p className={stylesCheckout.tag}>Preis: <span>{parsePrice(product.price)}€</span></p>
                                        <img alt='Entfernen' className={stylesCheckout.close} draggable={false} src='/icon/close.svg' onClick={() => removeProduct(product)}/>
                                    </div>
                                )
                            }) : <p>leer</p>}
                        </div>
                        {products.length > 0 ? <Link onClick={updateSession} href={`/checkout/${sessionId}`}><a><h3 className={styles.buy}>Kaufen</h3></a></Link>
                        : <h3 className={styles.buy + " " + styles.buyBlocked}>Kaufen</h3>}
                    </Drawer>
                    <Menu control={<img className={styles.menuItem} src="/icon/menu.svg" />}>
                        <Menu.Label>Einstellungen</Menu.Label>
                        <Menu.Item>Hier</Menu.Item>
                        <Menu.Item>kann</Menu.Item>
                        <Menu.Item>ihre</Menu.Item>
                        <Menu.Item>Webung</Menu.Item>
                        <Menu.Item>stehen</Menu.Item>
                    </Menu>
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
                                <p>{parsePrice(element.price)}€</p>
                                <img alt='Einkaufswagen' draggable={false} src='/icon/shopping_cart.svg' onClick={() => addProduct(element)}/>
                            </div>
                        </div>
                    )
                })}</div>
            </div>
            <div className={styles.footer}></div>
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