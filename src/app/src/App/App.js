import { Text, Container, Title, Divider, Grid, Skeleton } from '@mantine/core';
import useStyles from './styles.js';
import ServerComponent from '../components/servercomponent';

function App() {

    const { classes } = useStyles();

    return (
        <>
            <Container>
                <Title
                    align='center'
                    mt='xl'
                >ASG Schulshop</Title>
            </Container>
            <Divider
                mt='xl'
                label='Unsere Pakete'
                labelPosition='center'
            />
            <ServerComponent
                path='/bundles'
                error={
                    <Text
                        align='center'
                        color='red'
                    >
                        Unerwarteter Fehler!
                    </Text>
                }
                loading={
                    <Grid align={'center'}>
                        <Grid.Col span={2}><Skeleton height={50} width={200} /></Grid.Col>
                        <Grid.Col span={2}><Skeleton height={50} width={200} /></Grid.Col>
                        <Grid.Col span={2}><Skeleton height={50} width={200} /></Grid.Col>
                    </Grid>
                }
            >
                {(data) => {
                    return <Text>{data}</Text>
                }}
            </ServerComponent>
            <Divider
                mt='xl'
                label='Einzelne Produkte'
                labelPosition='center'
            />
            <ServerComponent
                path='/products'
                error={
                    <Text
                        align='center'
                        color='red'
                    >
                        Unerwarteter Fehler!
                    </Text>
                }
                loading={
                    <Grid align={'center'}>
                        <Grid.Col span={2}><Skeleton height={50} width={200} /></Grid.Col>
                        <Grid.Col span={2}><Skeleton height={50} width={200} /></Grid.Col>
                        <Grid.Col span={2}><Skeleton height={50} width={200} /></Grid.Col>
                    </Grid>
                }
            >
                {(data) => {
                    return <Text>{data}</Text>
                }}
            </ServerComponent>
        </>
    );
}

export default App;