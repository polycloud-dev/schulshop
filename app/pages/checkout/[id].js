import styles from '../../styles/Checkout.module.css'

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from "react";
import sessions from "../../backend/sessions"

export default function Checkout({session, productsSession}) {

    const [products, setProducts] = useState(productsSession);

    const [spamTimer, setSpamTimer] = useState();

    useEffect(() => {
        if(products.length === 0) setTimeout(() => window.location.href = '/', 1000) 
    }, [])

    function removeProduct(product) {
        toast('Vom Warenkorb entfernt!', {"theme": "dark", "icon": "🛒"});
        const a = products
        a.pop(product)
        setProducts(a)
        saveSession()
        window.scrollTo(0, document.getElementById("productContainer").scrollHeight);
        if(products.length === 0) setTimeout(() => window.location.href = '/', 1000) 
    }

    function saveSession() {
        if(!session) return;
        clearTimeout(spamTimer)
        setSpamTimer(setTimeout(() => fetch(`/api/checkout/update/${sessionId}`, {
            "method": "PUT",
            "body": JSON.stringify({
                "products": products
            })
        }), 2000));
    }

    return (
        <div className={styles.center}>
            <div className={styles.main}>
                <h2>Warenkorb | Kaufen</h2>
                <div className={styles.container} id='productContainer'>
                    {products.length == 0 ? <h2>Leer</h2> : null}
                    {products.map(product => {
                        return (
                            <div key={product.id} className={styles.item}>
                                <img alt={`Bild von ${product.name}`} src={product.thumbnail} />
                                <p className={styles.name}>{product.name}</p>
                                <p className={styles.tag}>Preis: <span>{product.price}€</span></p>
                                <img alt='Entfernen' className={styles.close} draggable={false} src='/icon/close.svg' onClick={() => removeProduct(product)}/>
                            </div>
                        )
                    })}
                    
                </div>
                <div className={styles.payment}>
                    <img draggable={false} alt="Bild nicht gefunden" src="https://img.icons8.com/pastel-glyph/64/000000/pay.png"/>
                    <img draggable={false} alt="Bild nicht gefunden" src="https://www.paypalobjects.com/webstatic/i/logo/rebrand/ppcom.svg"/>
                </div>
            </div>
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

export async function getServerSideProps(context) {
    const sessionId = context.query.id;
    const session = await new sessions.timedTask(() => {
        return sessions.get(sessionId)
    }).start();
    if(session instanceof Error) {
        console.log(session.message);
        return {"props": {}, "redirect": {"destination": "/error", "permanent": false}}
    }
    return {"props": {"session": sessionId, "productsSession": session.products}}
}