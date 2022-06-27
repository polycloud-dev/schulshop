import { Container, Title, Text,  Button, Modal, Group } from "@mantine/core"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AlertCircle, TruckDelivery } from "tabler-icons-react"
import useShoppingCart from "../modules/shoppingcart"

export default function OrderedPage() {

    const { isOrdered } = useShoppingCart()
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false)

    const order_number = '1234'

    useEffect(() => {
        if(!isOrdered) navigate('/')
    }, [isOrdered, navigate])

    if(!isOrdered) {
        return (
            <>
                Weiterleitung fehlgeschlagen. <br/>
                Klicken Sie <Link
                    to={{
                        pathname: '/',
                    }}
                >hier</Link> um zur Startseite zurückzukehren.
            </>
        )
    }

    return (
        <Container
            mt='6rem'
            style={{
                textAlign: "center",
                maxWidth: "50rem",
                height: "100%",
            }}
        >
            <Title
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TruckDelivery
                    size='2rem'
                    style={{
                        marginTop: '.2rem',
                        marginRight: '.2rem',
                    }}
                />
                Bestellt!
            </Title>
            <Text
                size="lg"
            >
                Die Bestellung war erfolgreich und kann abgeholt werden.
            </Text>
            <Text
                color='blue'
                style={{
                    marginTop: "1rem",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    letterSpacing: ".3rem",
                }}
            >
                {order_number}
            </Text>
            <Text
                color='dimmed'
            >
                Die Nummer ist benötigt, um die Bestellung abzuholen.
            </Text>
            <Button
                mt='2rem'
                onClick={() => setIsModalOpen(true)}
            >
                Zurück zum Shop
            </Button>
            <Modal
                centered
                withCloseButton={false}
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <Group
                    position='center'
                    direction="column"
                    style={{
                        textAlign: "center",
                    }}
                >
                    <AlertCircle
                        size='2rem'
                        color='red'
                    />
                    <Text
                        size="lg"
                    >
                        Hast du dir deine Bestellnummer aufgeschrieben?<br/>
                        Die Nummer wird danach nicht mehr gezeigt werden.
                    </Text>
                    <Group>
                        <Button
                            mt='2rem'
                            onClick={() => navigate('/')}
                        >
                            Hab ich
                        </Button>
                        <Button
                            mt='2rem'
                            onClick={() => setIsModalOpen(false)}
                        >
                            Noch nicht
                        </Button>
                    </Group>
                </Group>
            </Modal>
        </Container>
    )
}