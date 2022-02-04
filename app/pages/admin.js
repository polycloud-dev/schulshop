export default function Admin() {
    return (
        <div>
            top secret
        </div>
    )
}

export async function getServerSideProps(context) {
    //check if localhost
    if(context.req.headers.host.search(/(localhost)/i) !== 0) return {"notFound": true};
    return {"props": {}}
}