export default function ShoppingCart({index, style}) {
    return (
        <svg style={style} viewBox='0 0 220 200' width={220} height={200} width xmlns="http://www.w3.org/2000/svg">
            <image href='/icon/shopping_cart.svg' height='200' width='200'/>
            {index > 0 ? <circle cx="160" cy="145" r="55" fill="orange"/>
            : null}
            {index > 99 ? <text style={{"userSelect": "none"}} x="123" y="164" fill="black" font-size="3rem" font-weight="bold">99+</text>
            : index > 9 ? <text style={{"userSelect": "none"}} x="125" y="167" fill="black" font-size="4rem" font-weight="bold">{index}</text>
            : index > 0 ?<text style={{"userSelect": "none"}} x="135" y="172" fill="black" fontSize="5rem" fontWeight="bold">{index}</text>
            : null}
        </svg>
    )
}