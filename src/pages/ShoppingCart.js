import { Button, Card, Container, Divider, Group, Input, InputWrapper, Text, Title, useMantineTheme, Image, NumberInput, ActionIcon, Collapse } from '@mantine/core'
import { At, CaretDown, CaretUp, Id, School, Trash } from 'tabler-icons-react'
import Logo from '../components/logo/logo'
import { useState, useEffect } from 'react'
import useShoppingCart from '../modules/shoppingcart'
import { useNavigate } from 'react-router-dom'
import { useServer } from '../modules/servercomponent'
import useSafeState, { StateProvider } from '../modules/statemanager'

export default function ShoppingCartPage() {

    const { cart } = useShoppingCart() 
    const navigate = useNavigate()

    return (
        <StateProvider>
            <Container
                mt='4rem'
                style={{
                    textAlign: 'center',
                    maxWidth: '30rem',
                }}
            >
                <Logo size='7rem' />
                <Title>Warenkorb</Title>
                <Divider my='xl' />
                <Group
                    position='center'
                >
                    {cart.length === 0 ? (
                        <Text
                            size='xl'
                            color='dimmed'
                            my='xl'
                        >
                            Warenkorb ist leer
                        </Text>
                    ) : 
                    cart.map(item => {
                        return (
                            <Item item={item} />
                        )
                    })}
                </Group>
                <Divider my='xl' />
                <Form />
                <Text
                    mt='xl'
                    color='dimmed'
                >
                    Nur Bargeldzahlung <br/>
                    Abholung: Raum A007
                </Text>
            </Container>
        </StateProvider>
    )

    function Item({ item }) {
        if(item.type === 'product') return <ProductItem item={item} />
        else if(item.type === 'bundle') return <BundleItem item={item} />
        else return <></>
    }

    function ProductItem({ item, bundle, ...props }) {

        const theme = useMantineTheme()

        return (
            <Card
                {...props}
                style={{
                    backgroundColor: theme.colors.gray[0],
                    display: 'flex',
                    width: '100%',
                }}
                radius='md'
                shadow='xl'
                p='xs'
                key={item.id}
            >
                <ProductCard item={item} bundle={bundle}/>
            </Card>
        )
    }

    function BundleItem({ item }) {

        const theme = useMantineTheme()

        const [open, setOpen] = useSafeState('bundle_open_' + item.uniqueId)

        const [cachedBundles, setBundles] = useState({})
        const [cachedProducts, setProducts] = useState({})

        const bundleServer = useServer('/bundles')
        const productServer = useServer('/products')

        useEffect(() => {
            bundleServer.cachedFetch()
                .then(data => setBundles(data))
                .catch(err => console.log(err));
            productServer.cachedFetch()
                .then(data => setProducts(data))
                .catch(err => console.log(err));
        }, [bundleServer, productServer])

        const bundle = cachedBundles[item.id]
        const products = item.content.map(entry => cachedProducts[entry.id]).filter(product => product !== undefined)

        if(!bundle || !products) return <></>

        const total_price = products.reduce((acc, product) => {
            return acc + product.price
        }, 0)

        return (
            <>
                <Card
                    style={{
                        backgroundColor: theme.colors.gray[0],
                        display: 'flex',
                        width: '100%',
                    }}
                    radius='md'
                    shadow='xl'
                    p='xs'
                    key={item.id}
                >
                    <BundleCard item={item} setOpen={setOpen} open={open} total_price={total_price} bundle={bundle} />
                </Card>
                <Collapse in={open}>
                    <Group
                        spacing='xs'
                    >   
                        {item.content.map(product_item => (
                            <ProductItem item={{...product_item, type: 'product'}} bundle={item} />
                        ))}
                    </Group>
                </Collapse>
            </>
        )
    }

    function BundleCard({ item, setOpen, open, bundle, total_price }) {

        const { setQuantity, formatCurrency } = useShoppingCart()
        const [hoverTrash, setHoverTrash] = useState(false)

        function handleDelete() {
            setQuantity(item, 0)
        }

        return (
            <>
                <Card.Section
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Container
                            style={{
                                width: '3rem',
                                height: '3rem',
                                margin: 0,
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ActionIcon
                                onClick={() => setOpen(!open)}
                            >
                                {open ? (
                                        <CaretUp size='1.5rem'/>
                                    ) : (
                                        <CaretDown size='1.5rem'/>
                                    )
                                }
                            </ActionIcon>
                        </Container>
                    </Card.Section>
                <Group
                    position='apart'
                    style={{
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <Group
                        direction='column'
                        ml='md'
                        spacing={0}
                        style={{
                            width: '13rem',
                        }}
                    >
                        <Title
                            style={{
                                fontSize: '1.5rem',
                            }}
                        >
                            {bundle.name}
                        </Title>
                        <Text
                            color='dimmed'
                        >
                            {bundle.description}
                        </Text>
                    </Group>
                    <Text
                        color='cyan'
                    >
                        {formatCurrency(total_price)}€
                    </Text>
                    <Group>
                        <ActionIcon
                            color={hoverTrash ? 'red' : 'gray'}
                            onMouseEnter={() => setHoverTrash(true)}
                            onMouseLeave={() => setHoverTrash(false)}
                            onClick={handleDelete}
                        >
                            <Trash />
                        </ActionIcon>
                    </Group>
                    
                </Group>
            </>
        )
    }

    function ProductCard({ item, bundle=false }) {

        const { setQuantity, formatCurrency } = useShoppingCart()

        const [hoverTrash, setHoverTrash] = useState(false)

        const [products, setProducts] = useState({})
        const { cachedFetch } = useServer('/products')

        useEffect(() => {
            cachedFetch()
                .then(data => setProducts(data))
        }, [])

        const product = products[item.id]

        if(!product) return null

        function handleDelete() {
            setQuantity(item, 0, bundle)
        }

        function handleChange(value) {
            if(value < 0 || value > 10) return
            setQuantity(item, value, bundle)
        }

        return (
            <>
                <Card.Section
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Image width='3rem' height='3rem' fit='contain' src={`${process.env.REACT_APP_API_HOST}/images/${product.image}`} alt={product.name} />
                </Card.Section>
                <Group
                    position='apart'
                    style={{
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    <Group
                        direction='column'
                        ml='md'
                        spacing={0}
                        style={{
                            width: '13rem',
                        }}
                    >
                        <Title
                            style={{
                                fontSize: '1.5rem',
                            }}
                        >
                            {product.name}
                        </Title>
                        <Text
                            color='dimmed'
                        >
                            {product.description}
                        </Text>
                    </Group>
                    <Text
                        color='cyan'
                    >
                        {formatCurrency(product.price)}€
                    </Text>
                    <Group>
                        <ActionIcon
                            color={hoverTrash ? 'red' : 'gray'}
                            onMouseEnter={() => setHoverTrash(true)}
                            onMouseLeave={() => setHoverTrash(false)}
                            onClick={handleDelete}
                        >
                            <Trash />
                        </ActionIcon>
                        <NumberInput 
                            defaultValue={item.quantity}
                            style={{
                                width: '4rem',
                            }}
                            min={1}
                            max={10}
                            onChange={handleChange}
                        />
                    </Group>
                    
                </Group>
            </>
        )
    }

    function Form() {

        const [name, setName] = useState({ value: undefined })
        const [schoolClass, setSchoolClass] = useState({ value: undefined })
        const [email, setEmail] = useState({ value: undefined })
        
        const { getRawCart, confirmOrder } = useShoppingCart() 

        function submit() {
            // check if name is valid
            // name has to be min 2 words with at least one character
            // example: "John Doe" or "John Foo Doe"
            if(!name.value) setName({ error: 'Name ist benötigt' })
            else if(!name.value.match(/^[a-zA-ZäöüÄÖÜß]+\s[a-zA-ZäöüÄÖÜß]+/)) setName({ value: name.value, error: 'Bitte geben Sie einen gültigen Namen ein.' })
            // check if school class is valid
            // school class has to be a number between 1 and 12 and a character between a and z
            // example: 12a or 5b
            if(!schoolClass.value) setSchoolClass({ error: 'Klasse ist benötigt' })
            else if(!schoolClass.value.match(/^[1-9][0-3]?[a-z]$/)) setSchoolClass({ value: schoolClass.value, error: 'Bitte geben Sie eine gültige Klasse ein.' })
            // check if email is valid
            // example: mail@mail.com or 123@abc.xy
            if(email.value && !email.value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) setEmail({ value: email.value, error: 'Bitte geben Sie eine gültige Email-Adresse ein.' })
        
            // if there are no errors, submit the form
            if(!name.error && !schoolClass.error && !email.error) {

                const products = getRawCart()

                fetch(`${process.env.REACT_APP_API_HOST}/api/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name.value,
                        school_class: schoolClass.value,
                        email: email.value,
                        products,
                    }),
                }).then(res => res.json())
                .then(res => {
                    if(res.success) {
                        confirmOrder({order_id: res.order_id})
                        navigate('/bestellt')
                    } else {
                        console.log('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.')
                        console.log(res.error);
                    }
                })
            }
        }

        return (
            <Group
                spacing='md'
                position='center'
                direction='column'
                style={{
                    textAlign: 'left',
                }}
            >
                <InputWrapper
                    required
                    label='Name'
                    error={name.error}
                >
                    <Input
                        icon={<Id />}
                        placeholder='Vor-/ Nachname'
                        style={{
                            width: '20rem',
                        }}
                        onChange={(e) => setName({value: e.target.value})}
                    />
                </InputWrapper>
                <InputWrapper
                    required
                    label='Klasse'
                    error={schoolClass.error}
                >
                    <Input
                        icon={<School />}
                        placeholder='Klasse'
                        style={{
                            width: '20rem',
                        }}
                        onChange={(e) => setSchoolClass({value: e.target.value})}
                    />
                </InputWrapper>
                <InputWrapper
                    label='Email'
                    description='Benötigt für Bestellbestätigung und Rückmeldungen'
                    error={email.error}
                >
                    <Input
                        icon={<At />}
                        placeholder='Email'
                        style={{
                            width: '20rem',
                        }}
                        onChange={(e) => setEmail({value: e.target.value})}
                    />
                </InputWrapper>
                <Button
                    onClick={submit}
                >
                    Bestellen
                </Button>
            </Group>
        )
    }
}