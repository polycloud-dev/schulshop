import styles from '../../styles/Error.module.css'

import Image from 'next/image';
import Head from 'next/head';

export default function ErrorPage({error, message, from}) {
    return (
        <div className={styles.center}>
            <Head>
                <title>Error | {error}</title>
            </Head>
            <div className={styles.error}>
                <div className={styles.imgContainer}>
                    <Image draggable={false} src='/icon/warning.svg' alt='warning' height='100%' width='100%'/>
                </div>
                <h1 className={styles.name}>{error}</h1>
                <h3 className={styles.message}>{message}</h3>
                <h4 onClick={() => window.location.href = from} className={styles.return}><div><Image draggable={false} src='/icon/return.svg' alt='return' height='100%' width='100%'/></div>wiederholen</h4>
            </div>
        </div>
    )
}

const errors = {
    "unknown": {
        "name": "Unbekannter Fehler",
        "message": "Unbekannter Fehler aufgetreten!"
    },
    "internal": {
        "name": "Interner Serverfehler",
        "message": "Serverfehler aufgetreten!"
    },
    "database-timeout": {
        "name": "Datenbank Verbindungsfehler",
        "message": "Verbindung mit Datenbank nicht möglich!"
    },
    "session-notfound": {
        "name": "Session nicht gefunden",
        "message": "Diese Session existiert nicht!",
        "redirect": "/"
    }
}

function getError(error) {
    const err = errors[error];
    if(!err) return errors['unknown'];
    return err;
}

import LogClient from '../../backend/logger';
const logClient = new LogClient('ErrorPage');

export async function getServerSideProps(context) {
    const errId = context.query.error;
    const error = getError(errId);
    const from = error.redirect ? error.redirect : context.query.from ? context.query.from : '/';
    logClient.log(`Error page visited! Error: '${error.name}'`);
    return {"props": {"error": error.name, "message": error.message, "from": from}}
}