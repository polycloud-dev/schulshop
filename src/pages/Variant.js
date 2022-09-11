import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useServer } from "../modules/servercomponent";
import { Container, Title, Text, Grid, useMantineTheme, Group, Button, Center } from "@mantine/core";
import useShoppingCart from "../modules/shoppingcart";
import { ArrowNarrowLeft } from "tabler-icons-react";
import Link from "../components/link";
import { showNotification } from "@mantine/notifications";
import { useMediaQuery } from '@mantine/hooks';

export default function VariantPage() {

    const { formatCurrency,addToCart } = useShoppingCart()

    const { id } = useParams();
    const navigate = useNavigate();

    const [selected, setSelected] = useState()

    const [product, setProduct] = useState()
    const { cachedFetch } = useServer('/products')

    const matches_0 = useMediaQuery('(max-width: 1200px)');
    const matches_small = useMediaQuery('(max-width: 800px)');
    const matches_mobile = useMediaQuery('(max-width: 480px)');

    useEffect(() => {
        cachedFetch()
            .then(data => {
                const product = data[id]
                if(!product) return navigate('/')
                setProduct(product)
                if(!selected) setSelected(product.variants[0])
            })
    }, [cachedFetch, id, navigate, selected])

    if(!product) return null

    function getPriceTag() {

        function Tag({ price }) {
            return (
                <Text
                    color='cyan'
                >{formatCurrency(price)}€</Text>
            )
        }

        if(product.old_price) {
            return (
                <Group
                    direction='column'
                    spacing={0}
                    position='center'
                >
                    <Text
                        color='dimmed'
                        style={{
                            textDecoration: 'line-through'
                        }}
                        size='xs'
                        my={0}
                    >{formatCurrency(product.old_price)}€</Text>
                    <Tag price={product.price} />
                </Group>
            )
        } else return <Tag price={product.price} />
    }

    function addItem() {
        if(addToCart({ 'id': `${id}-${selected.name}`, 'product_id': id, 'type': 'variant', 'variant': selected.name })) {
            showNotification({
                title: 'Produkt hinzugefügt',
                message: `${product.name} "${selected.name}" wurde zum Warenkorb hinzugefügt`,
                autoClose: 1500,
            })
        }
    }

    return (
        <Container
            mt='lg'
        >
            <Link color='dimmed' text={<Center inline ><ArrowNarrowLeft />Zurück zum Shop</Center>} path='/' />
            <Title
                mt='sm'
            >
                {product.name} {selected.name}
            </Title>
            <Text>{product.description}</Text>
            <Text
                mt='lg'
                size='lg'
                weight='bold'
            >
                Varianten
            </Text>
            <Container>
                <Grid
                    mt='md'
                    justify='flex-start'
                    gutter='xs'
                >
                    {product.variants.map(variant => (<Grid.Col span={
                        matches_mobile ? 6
                        : matches_small ? 4
                        : matches_0 ? 3
                        : 2
                        } ><VariantCard variant={variant} selected={selected} setSelected={setSelected} /></Grid.Col> ))}
                </Grid>
            </Container>
            <Group
                mt='xl'
                mb='md'
            >
                <Button
                    disabled={!selected}
                    onClick={addItem}
                >Kaufen</Button>
                {getPriceTag()}
            </Group>
        </Container>
    )
}

function VariantCard({ variant, selected, setSelected }) {

    const [hovering, setHovering] = useState(false)

    const theme = useMantineTheme()

    const borderColor = selected && selected.name === variant.name ? theme.colors.blue[5] : hovering ? theme.colors.cyan[5] : theme.colors.gray[5]

    return (
        <Container
            key={variant.name}
            style={{
                border: '2px solid',
                borderColor: borderColor,
                padding: '1rem',
                borderRadius: '0.5rem',
                height: '6rem',
                width: '6rem',
                backgroundImage: `url(${process.env.REACT_APP_IMAGE_HOST}/images/${variant.image})`,
                backgroundSize: 'cover',
                display: 'flex',
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => setSelected(variant)}
        >
            <Text
                mx='auto'
                mt='auto'
                color='dark'
                weight={500}
                style={{
                    textShadow: '0 0 0.5rem #fff',
                }}
            >
                {variant.name}
            </Text>
        </Container>
    )
}