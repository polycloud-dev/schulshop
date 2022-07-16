import { Text, Container, Title, Divider, SimpleGrid, Skeleton, Tooltip, Badge, Card, Image, Group, useMantineTheme, Button, Indicator, MediaQuery, Space, ActionIcon } from '@mantine/core';
import ServerComponent from '../components/servercomponent';
import { ArrowUpRight, Leaf, ShoppingCart as ShoppingCartIcon } from 'tabler-icons-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useServer } from '../modules/servercomponent';
import useShoppingCart from '../modules/shoppingcart';
import { showNotification } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import HelpMenu from '../components/helpmenu';
import Link from '../components/link';

export default function HomePage() {

    const CARD_WIDTH = 200;
    const CARD_HEIGHT = 350;

    return (
        <>
            <Container
                style={{
                    userSelect: 'none',
                    flexDirection: 'row',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <WelcomeTitle/>
            </Container>
            <HeadMenu />
            <MediaQuery
                query='(min-width: 600px)'
                styles={{
                    marginTop: '2rem'
                }}
            >
                <div
                    style={{
                        padding: '0 1rem'
                    }}
                >
                    <ClassBundles card_width={CARD_WIDTH} card_height={CARD_HEIGHT} />

                    <Bundles card_width={CARD_WIDTH} card_height={CARD_HEIGHT} />

                    <Products card_width={CARD_WIDTH} card_height={CARD_HEIGHT} />
                </div>
            </MediaQuery>
            <Space h='2rem' />
        </>);

    function HeadMenu() {

        const matches_0 = useMediaQuery('(max-width: 1200px)');
        const matches_1 = useMediaQuery('(max-width: 800px)');

        return (
            <Group
                mt={matches_0 ? matches_1 ? '3rem' : '1rem' :  '0'}
                position={matches_1 ? 'center': 'right'}
                mr={matches_1 ? '0': '4rem'}
                spacing='xl'
            >
                <Link text='Über uns' path='/about' tooltip='Das sind wir' />
                <Link text='Kontakt' path='/kontakt' tooltip='Hier kann man uns erreichen' />
                <HelpMenu />
                <ShoppingCart />
            </Group>
        )
    }

    function ShoppingCart() {

        const { size, cart } = useShoppingCart();

        const navigate = useNavigate();

        function handleClick() {
            navigate('/einkaufswagen');
        }

        return (
            <ActionIcon
                variant='hover'
                onClick={handleClick}
            >
                <Indicator
                    position="bottom-end"
                    size={20}
                    offset={4}
                    label={size()}
                    disabled={cart.length === 0}
                >
                    <ShoppingCartIcon size={30} />
                </Indicator>
            </ActionIcon>
        )
    }
    
    function getBadges(badges, created_at) {
        let badgeList = [];
        if(badges) badgeList = JSON.parse(JSON.stringify(badges))
        // check if 5 or fewer days ago
        if(Math.floor((new Date() - new Date(created_at)) / (1000 * 60 * 60 * 24)) <= 5) {
            badgeList.push({
                'text': 'Neu',
                'color': 'cyan',
            })
        }
        // trim to 3 badges
        if(badgeList.length > 2) {
            badgeList = badgeList.slice(0, 2);
        }

        return badgeList.map(badge => {
            return (
                <Badge
                    color={badge.color}
                    gradient={badge.gradient}
                    variant={badge.variant || 'outline'}
                    key={badge.text}
                >
                    {badge.text}
                </Badge>
            )
        })
    }

    function LabelDivider({ label }) {
        return <Divider
            mt='xl'
            label={label}
            labelPosition='center'
            mb='md'
        />
    }

    function ErrorCards() {
        return (
            <Text
                align='center'
                color='red'
                height={300}
            >
                Fehler
            </Text>
        )
    }

    function SkeletonCard() {
        return <Skeleton height={300} width={200} />
    }

    function SkeletonCards() {
        return (
            <SimpleGrid
                columns={1}
                style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}
                spacing='xl'
            >
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </SimpleGrid>
        )
    }

    function CardBody({ item, badges, name, description, price, old_price=undefined, height }) {
        
        const { addToCart, formatCurrency } = useShoppingCart()

        function addItem() { 
            if(addToCart(item)) {
                showNotification({
                    title: 'Produkt hinzugefügt',
                    message: `${name} wurde zum Warenkorb hinzugefügt`,
                    autoClose: 1500,
                })
            }
        }

        function getPriceTag() {

            function Tag({price}) {
                return (
                    <Text
                        color='cyan'
                    >{formatCurrency(price)}€</Text>
                )
            }

            if(old_price) {
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
                        >{formatCurrency(old_price)}€</Text>
                        <Tag price={price} />
                    </Group>
                )
            }else return <Tag price={price} />
        }

        return (
            <Container
                p={0}
                style={{
                    margin: 0,
                    width: '100%',
                    height: height/2,
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                }}
            >
                <Group
                    position='right'
                    my={2}
                    spacing={2}
                >
                    {badges}
                </Group>
                <Container
                    style={{
                        maxHeight: '5rem',
                        overflow: 'hidden',
                    }}
                >
                    <Title
                        style={{
                            fontSize: name.length > 15 ? '1rem' : '1.2rem',
                        }}
                        align='center'
                    >
                        {name}
                    </Title>
                    <Text
                        color='dimmed'
                        align='center'
                        lineClamp={2}
                        style={{
                            fontSize: description.length > 18 ? '0.8rem' : '1rem',
                        }}
                    >
                        {description}
                    </Text>
                </Container>
                <Group
                    mt='auto'
                    mb='md'
                >
                    <Button
                        onClick={addItem}
                    >Kaufen</Button>
                    {getPriceTag()} 
                </Group>
            </Container>
        )
    }

    function BundleCards({ data, width, height }) {

        const theme = useMantineTheme()

        const [badges, setBadges] = useState({})
        const [products, setProducts] = useState({})

        const { cachedFetch } = useServer('/products')

        useEffect(() => {
            // fetch
            cachedFetch().then(data => {
                setProducts(data)
            }).catch(err => {
                console.log(err)
            }
        )}, [cachedFetch])

        return (
            <SimpleGrid
                columns={1}
                style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}
                spacing='xl'
            >
                {Object.keys(data).map(key => {

                    const bundle = data[key]

                    const content = bundle.content;
                    if(!content) return 'error'

                    const bundle_products = content.map(product => {
                        const result = products[product.id]
                        if(!result) return
                        result.quantity = product.quantity
                        return result
                    }).filter(product => product !== undefined)

                    const total_price = bundle_products.reduce((acc, product) => {
                        return acc + product.price * product.quantity
                    }, 0)
                    const total_old_price = bundle_products.reduce((acc, product) => {
                        if(product.old_price) return acc + product.old_price * product.quantity
                        return acc + product.price * product.quantity
                    }, 0)

                    if(!badges[key]) {
                        setBadges({
                            ...badges,
                            [key]: getBadges(bundle.badges, bundle.created_at)
                        })
                    }

                    return (
                        <Card
                            radius='md'
                            shadow='xl'
                            p='lg'
                            style={{
                                width: width,
                                height: height,
                                backgroundColor: theme.colors.gray[1],
                            }}
                            key={key}
                        >
                            <Card.Section>
                                <Group
                                    spacing={0}
                                >
                                    {
                                        bundle_products.map(product => {
                                            return (
                                                <Image height={height/2} width={width/bundle_products.length} fit='cover' src={`${process.env.REACT_APP_API_HOST}/images/${product.image}`} alt={product.name} />
                                            )
                                        })
                                    }
                                </Group>
                            </Card.Section>
                            <CardBody
                                key={key}
                                item={{'id': key, 'type': 'bundle', 'content': content}}
                                badges={badges[key]}
                                name={bundle.name}
                                description={bundle.description}
                                price={total_price}
                                old_price={total_old_price !== total_price ? total_old_price : undefined}
                                height={height}
                            />
                        </Card>
                    )
                })}
            </SimpleGrid>
        )
    }

    function ProductCards({ data, height, width }) {

        const theme = useMantineTheme()

        const [badges, setBadges] = useState({})

        return (
            <SimpleGrid
                columns={1}
                style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}
                spacing='xl'
            >
                {Object.keys(data).map(key => {
                    const product = data[key]
                    if(!badges[key]) {
                        setBadges({
                            ...badges,
                            [key]: getBadges(product.badges, product.created_at)
                        })
                    }
                    return (
                        <Card
                            radius='md'
                            shadow='xl'
                            p='lg'
                            style={{
                                width: width,
                                height: height,
                                backgroundColor: theme.colors.gray[1],
                            }}
                            key={key}
                        >
                            <Card.Section>
                                <Image height={height/2} fit='contain' src={`${process.env.REACT_APP_API_HOST}/images/${product.image}`} alt={product.name} />
                            </Card.Section>
                            <CardBody
                                badges={badges[key]}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                old_price={product.old_price}
                                height={height}
                                item={{'id': key, 'type': 'product'}}
                            />
                        </Card>
                    )
                })}
            </SimpleGrid>
        )
    }

    function Products({ card_width, card_height }) {
        return <ServerComponent
            path='/products'
            error={<ErrorCards />}
            loading={<SkeletonCards />}
        >
            {(data) => {
                if(Object.keys(data).length > 0) {
                    return <>
                        <LabelDivider label={'Einzelne Produkte'} />
                        <ProductCards data={data} width={card_width} height={card_height} />
                    </>
                }
            }}
        </ServerComponent>
    }

    function ClassBundles({ card_width, card_height }) {
        return <ServerComponent
            path='/class_bundles'
            error={<ErrorCards />}
            loading={<SkeletonCards />}
        >
            {(data) => {
                if(Object.keys(data).length > 0) {
                    return <>
                        <LabelDivider label={'Klassenpakete'} />
                        <BundleCards data={data} width={card_width} height={card_height} />
                    </>
                }
            }}
        </ServerComponent>;
    }

    function Bundles({ card_width, card_height }) {
        return <ServerComponent
            path='/bundles'
            error={<ErrorCards />}
            loading={<SkeletonCards />}
        >
            {(data) => {
                if(Object.keys(data).length > 0) {
                    return <>
                        <LabelDivider label={'Pakete'} />
                        <BundleCards data={data} width={card_width} height={card_height} />
                    </>
                }
            }}
        </ServerComponent>;
    }

    function WelcomeTitle() {
        return <Title
            align='center'
            mt='xl'
            style={{ 
                fontSize: '3rem',
            }}
        >
            Willkommen beim {' '}
            <GradientName/>
            <DescriptionText />
        </Title>;

        function DescriptionText() {
            return <Text
                color='dimmed'
            >
                Hier können Sie einfach und {' '}
                <SustainableText />
                Schulmaterialien bestellen.
            </Text>;

            function SustainableText() {

                const [hover, setHover] = useState(false)
                const navigate = useNavigate();

                return <Tooltip
                    label={<Text style={{display: 'flex', fontSize: '.8rem'}}>So sind wir nachhaltig<ArrowUpRight size={15} style={{margin: 'auto 0'}} /></Text>}
                    withArrow
                >
                    <Text
                        component="span"
                        variant='gradient'
                        gradient={{ from: '#16cc95', to: '#16cc3e', deg: 45 }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                            cursor: 'pointer',
                            textDecoration: hover ? 'underline #16cc3e' : 'none',
                        }}
                        onClick={() => {
                            navigate('/nachhaltig')
                        }}
                    >
                        nachhaltig
                        <Leaf
                            size={14}
                            color='#16cc3e' />
                        {' '}
                    </Text>
                </Tooltip>;
            }
        }

        function GradientName() {
            return <Text
                component="span"
                variant='gradient'
                gradient={{ from: 'indigo', to: 'cyan'}}
                style={{ fontSize: 'inherit' }}
            >Schulshop</Text>
        }
    }
}