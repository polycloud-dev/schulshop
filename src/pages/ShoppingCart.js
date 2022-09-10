import { Button, Card, Container, Divider, Group, Input, InputWrapper, Text, Title, useMantineTheme, Image, NumberInput, ActionIcon, Modal } from '@mantine/core'
import { At, BoxMultiple, Id, School, Trash, CircleX } from 'tabler-icons-react'
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
                        <>
                            {cart.map(item => {
                                return (
                                    <Item item={item} />
                                )
                            })}
                            <Total />
                        </>
                    }
                </Group>
                <Divider my='md' />
                <Form />
                <Text
                    mt='xl'
                    color='dimmed'
                >
                    Nur Bargeldzahlung <br />
                    Abholung: Raum A007
                </Text>
            </Container>
        </StateProvider>
    )

    function Total() {

        const { cart, formatCurrency } = useShoppingCart()

        const [cachedBundles, setBundles] = useState()
        const [cachedClassBundles, setClassBundles] = useState()
        const [cachedProducts, setProducts] = useState()

        const bundleServer = useServer('/bundles')
        const classBundleServer = useServer('/class_bundles')
        const productServer = useServer('/products')

        useEffect(() => {
            bundleServer.cachedFetch()
                .then(data => setBundles(data))
                .catch(err => console.log(err));
            classBundleServer.cachedFetch()
                .then(data => setClassBundles(data))
                .catch(err => console.log(err));
            productServer.cachedFetch()
                .then(data => setProducts(data))
                .catch(err => console.log(err));
        }, [bundleServer, productServer, classBundleServer])

        if(!cachedBundles || !cachedProducts || !cachedClassBundles) return null

        const items = []

        cart.forEach(item => {
            if (item.type === 'bundle') {
                if(!item.content) {
                    return items.push(item)
                }
                item.content.forEach(item => {
                    items.push(item)
                })
            } else items.push(item)
        })

        let total = items.reduce((acc, item) => {
            if(item.type === 'bundle') {
                const bundle = cachedBundles[item.id] || cachedClassBundles[item.id]
                return acc + bundle.price
            }
            const product = cachedProducts[item.id] || cachedProducts[item.product_id]
            const price = product ? product.price * item.quantity : 0
            return acc + price
        }, 0)

        return (
            <Group
                position='center'
                mt='xl'
                spacing={4}
            >
                <Text>
                    Gesamt:
                </Text>
                <Text
                    color='cyan'
                >
                    {formatCurrency(total)}€
                </Text>
            </Group>
        )
    }

    function Item({ item }) {
        if (item.type === 'product' || item.type === 'variant') return <ProductItem item={item} />
        else if (item.type === 'bundle') return <BundleItem item={item} />
        else return <></>
    }

    function ProductItem({ item, bundle, max, ...props }) {

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
                <ProductCard item={item} bundle={bundle} max={max} />
            </Card>
        )
    }

    function BundleItem({ item }) {

        const theme = useMantineTheme()

        const [open, setOpen] = useSafeState('bundle_open_' + item.uniqueId)

        const [cachedBundles, setBundles] = useState({})
        const [cachedClassBundles, setClassBundles] = useState()
        const [cachedProducts, setProducts] = useState({})

        const bundleServer = useServer('/bundles')
        const classBundleServer = useServer('/class_bundles')
        const productServer = useServer('/products')

        useEffect(() => {
            bundleServer.cachedFetch()
                .then(data => setBundles(data))
                .catch(err => console.log(err));
            classBundleServer.cachedFetch()
                .then(data => setClassBundles(data))
                .catch(err => console.log(err));
            productServer.cachedFetch()
                .then(data => setProducts(data))
                .catch(err => console.log(err));
        }, [bundleServer, productServer, classBundleServer])

        if(!cachedBundles || !cachedProducts || !cachedClassBundles) return null

        const bundle = cachedBundles[item.id] || cachedClassBundles[item.id]

        if(!bundle) return <></>

        let total_price = bundle.price

        if(item.content) {
            const products = item.content.map(entry => {
                const product = cachedProducts[entry.id]
                if (!product) return null
                product.quantity = entry.quantity
                return product
            }).filter(product => product !== undefined)

            if (!bundle || !products) return <></>

            total_price = products.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0)
        }

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
                {/* <Collapse
                    in={open}
                >
                    <Group
                        spacing='xs'
                    >   
                        {item.content.map(product_item => {
                            const bundle_item = bundle.content.find(bundle_item => bundle_item.id === product_item.id)
                            if(!product_item.variant) return <ProductItem item={{...product_item, type: 'product'}} bundle={item} max={bundle_item.quantity} />
                            else return <ProductItem item={{
                                id:`${product_item.id}-${product_item.variant}`,
                                product_id: product_item.id,
                                type: 'variant',
                                variant: product_item.variant,
                                quantity: product_item.quantity,
                            }} bundle={item} max={bundle_item.quantity} />
                        })}
                    </Group>
                </Collapse> */}
            </>
        )
    }

    function BundleCard({ item, setOpen, open, bundle, total_price }) {

        const { setQuantity, formatCurrency } = useShoppingCart()
        const [hoverTrash, setHoverTrash] = useState(false)

        const theme = useMantineTheme()

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
                        {
                            bundle.image ?
                                <Image
                                    height='2.2rem'
                                    width='2.2rem'
                                    fit='contain'
                                    src={`${process.env.REACT_APP_IMAGE_HOST}/images/${bundle.image}`}
                                    alt={bundle.name}
                                />
                            : <BoxMultiple size='2.2rem' color={theme.colors.gray[8]} />
                        }
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

    function ProductCard({ item, bundle = false, max = 10 }) {

        const { setQuantity, formatCurrency } = useShoppingCart()

        const [hoverTrash, setHoverTrash] = useState(false)

        const [products, setProducts] = useState({})
        const { cachedFetch } = useServer('/products')

        useEffect(() => {
            cachedFetch()
                .then(data => setProducts(data))
        }, [cachedFetch])

        const product = products[item.id] || products[item.product_id]
        if (!product) return null

        const variant = item.variant ? product.variants.find(variant => variant.name === item.variant) : undefined

        function handleDelete() {
            setQuantity(item, 0, bundle)
        }

        function handleChange(value) {
            if (value < 0 || value > max) return
            setQuantity(item, value, bundle)
        }

        const name = `${product.name} ${item.variant ? `"${variant.name}"` : ''}`
        const image = item.variant ? variant.image : product.image

        return (
            <>
                <Card.Section
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Image width='3rem' height='3rem' fit='contain' src={`${process.env.REACT_APP_IMAGE_HOST}/images/${image}`} alt={product.name} />
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
                            {name}
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
                            max={max}
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

        const [error, setError] = useState(false)

        const [isErrorModalOpen, setErrorModalOpen] = useState(false)

        const { getRawCart, confirmOrder, size } = useShoppingCart()

        function submit() {

            // these fields are required, because setSate is async
            let tempName = name
            let tempSchoolClass = schoolClass
            let tempEmail = email

            // check if name is valid
            // name has to be min 2 words with at least one character
            // example: "John Doe" or "John Foo Doe"
            if (!name.value) tempName = { error: 'Name ist benötigt' }
            else if (!name.value.match(/^[a-zA-ZäöüÄÖÜß]+\s[a-zA-ZäöüÄÖÜß]+/)) tempEmail = { value: name.value, error: 'Bitte geben Sie einen gültigen Namen ein.' }
            else if (name.value && name.value.length > 30) tempName = { value: name.value, error: 'Bitte geben Sie einen gültigen Namen ein.' }
            if (tempName !== name) setName(tempName)

            // check if school class is valid
            // school class has to be a number between 1 and 12 and a character between a and z
            // example: 12a or 5b
            if (!schoolClass.value) tempSchoolClass = { error: 'Klasse ist benötigt' }
            else if (!schoolClass.value.match(/^[1-9][0-3]?[a-z]$/)) tempSchoolClass = { value: schoolClass.value, error: 'Bitte geben Sie eine gültige Klasse ein.' }
            if (tempSchoolClass !== schoolClass) setSchoolClass(tempSchoolClass)

            // check if email is valid
            // example: mail@mail.com or 123@abc.xy
            if (email.value && !email.value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
                tempEmail = { value: email.value, error: 'Bitte geben Sie eine gültige Email-Adresse ein.' }
                setEmail(tempEmail)
            }

            // if there are no errors, submit the form
            if (!tempName.error && !tempSchoolClass.error && !tempEmail.error) {

                const products = getRawCart()

                fetch(`${process.env.REACT_APP_API_HOST}/order`, {
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
                        if (res.success) {
                            setError(false)
                            confirmOrder({ order_id: res.order_id })
                            navigate('/bestellt')
                        } else {
                            setError(res.error)
                            setErrorModalOpen(true)
                        }
                    })
            }
        }

        return (
            <>
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
                            onChange={(e) => setName({ value: e.target.value })}
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
                            onChange={(e) => setSchoolClass({ value: e.target.value })}
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
                            onChange={(e) => setEmail({ value: e.target.value })}
                        />
                    </InputWrapper>
                    <Button
                        onClick={submit}
                        disabled={size() === 0}
                    >
                        Bestellen
                    </Button>
                </Group>
                <Modal
                    centered
                    withCloseButton={false}
                    opened={isErrorModalOpen}
                    onClose={() => setErrorModalOpen(false)}
                >
                    <Group
                        position='center'
                        direction="column"
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <CircleX
                            size='2rem'
                            color='red'
                        />
                        <Text>
                            Es ist ein Fehler aufgetreten.
                        </Text>
                        <Text
                            size="sm"
                            color="red"
                        >
                            {error}
                        </Text>
                        <Group>

                            <Button
                                mt='1rem'
                                onClick={() => setErrorModalOpen(false)}
                            >
                                Schließen
                            </Button>
                        </Group>
                    </Group>
                </Modal>
            </>
        )
    }
}