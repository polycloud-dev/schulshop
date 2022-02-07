import Head from "next/head";

export default function Admin({products}) {
    return (
        <div>
            <Head>
                <title>Admin | Schulshop</title>
            </Head>
            {products.map(element => {
                return (
                    <div>
                        <h1>{element.name}</h1>        
                    </div>
                )
            })}
        </div>
    )
}

import {get} from '../database/index'

export async function getServerSideProps(context) {
    //check if localhost
    if(context.req.headers.host.search(/(localhost)/i) !== 0) return {"notFound": true};
    return {"props": {"products": get('products')}}
}