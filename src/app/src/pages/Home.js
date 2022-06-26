import { Text, Container, Title, Divider, SimpleGrid, Skeleton, Tooltip, Badge, Card, Image, Group, useMantineTheme, Space, Button, Stack } from '@mantine/core';
import ServerComponent from '../components/servercomponent';
import { ArrowUpRight, Leaf } from 'tabler-icons-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useServer } from '../modules/servercomponent';

function formatCurrency(price) {
    return (price/100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export default function HomePage() {

    const CARD_WIDTH = 200;
    const CARD_HEIGHT = 350;

    return (
        <>
            <Container
                style={{userSelect: 'none', flexDirection: 'row', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}
            >
                <WelcomeTitle/>
            </Container>
            <div
                style={{
                    margin: '3rem 0',
                    padding: '0 1rem',
                }}
            >
                <ClassBundles card_width={CARD_WIDTH} card_height={CARD_HEIGHT} />

                <LabelDivider label={'Pakete'} />
                <Bundles card_width={CARD_WIDTH} card_height={CARD_HEIGHT} />

                <LabelDivider label={'Einzelne Produkte'} />
                <Products card_width={CARD_WIDTH} card_height={CARD_HEIGHT} />
            </div>
        </>
    );
    
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
        return badgeList.map(badge => {
            return (
                <Badge
                    color={badge.color}
                    variant={'outline'}
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

    function CardBody({ badges, name, description, price, height }) {
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
                <Title
                    style={{
                        fontSize: '1.2rem',
                    }}
                    align='center'
                >
                    {name}
                </Title>
                <Text
                    color='dimmed'
                    align='center'
                    style={{
                        maxHeight: '30%',
                        overflow: 'hidden',
                    }}
                >
                    {description}
                </Text>

                <Group
                    mt='auto'
                    mb='md'
                >
                    <Button>Kaufen</Button>
                    <Text
                        color='cyan'
                    >{formatCurrency(price)}€</Text>
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
                    const bundle_products = content.map(product => {
                        return products[product]
                    }).filter(product => product !== undefined)

                    const total_price = bundle_products.reduce((acc, product) => {
                        return acc + product.price
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
                                                <Image height={height/2} width={width/bundle_products.length} fit='cover' src={`http://localhost/image/${product.image}`} alt={product.name} />
                                            )
                                        })
                                    }
                                </Group>
                            </Card.Section>
                            <CardBody badges={badges[key]} name={bundle.name} description={bundle.description} price={total_price} height={height} />
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
                                <Image height={height/2} fit='contain' src={`http://localhost/image/${product.image}`} alt={product.name} />
                            </Card.Section>
                            <CardBody badges={badges[key]} name={product.name} description={product.description} price={product.price} height={height} />
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
                return <ProductCards data={data} width={card_width} height={card_height} />;
            }}
        </ServerComponent>;
    }

    function ClassBundles({ card_width, card_height }) {
        return <ServerComponent
            path='/classbundles'
            error={<ErrorCards />}
            loading={<SkeletonCards />}
        >
            {(data) => {
                if(Object.keys(data).length > 0) {
                    return <>
                        <LabelDivider label={'Klassenpakete'} />
                        <BundleCards data={data} width={card_width} height={card_height} />;
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
                return <BundleCards data={data} width={card_width} height={card_height} />;
            }}
        </ServerComponent>;
    }

    function WelcomeTitle() {
        return <Title
            align='center'
            mt='xl'
            style={{ fontSize: '3rem'}}
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
                gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                style={{ fontSize: 'inherit' }}
            >Schulshop</Text>;
        }
    }
}