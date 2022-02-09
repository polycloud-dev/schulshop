import Head from "next/head";

export default function Admin({products}) {
    return (
        <div>
            <Head>
                <title>Admin | Schulshop</title>
            </Head>
            {products.map(element => {
                return (
                    <div key={element.id}>
                        <h1>{element.name}</h1>        
                    </div>
                )
            })}
        </div>
    )
}

import dbGet from '../database/index'

export async function getServerSideProps(context) {
    //check if localhost
    if(context.req.headers.host.search(/(localhost)/i) !== 0) return {"notFound": true};

    const data = await dbGet('products')
    if(!data) return {"props": {}, "redirect": {"destination": `/error/database-timeout`, "permanent": false}}
    
    return {"props": {"products": data}}
}