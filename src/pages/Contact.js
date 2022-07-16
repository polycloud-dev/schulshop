import { Button, Center, Container, Text, Title, Group } from '@mantine/core'
import { ArrowNarrowLeft, BrandAmongus, BuildingStore, Mail } from 'tabler-icons-react'
import Link from "../components/link"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ContactPage() {

    const navigate = useNavigate()

    const [mailIcon, setMailIcon] = useState(<Mail size={'1.2rem'} />)

    useEffect(() => {
        if(Math.random() > 0.999) setMailIcon(<BrandAmongus size={'1.2rem'} />)
    }, [])

    return (
        <Center
            style={{
                height: '60vh',
            }}
        >
            <Container>
                <Title
                    size='md'
                >
                    Kontakt
                </Title>
                <Text>
                    Hier können Sie uns kontaktieren.
                </Text>
                <Text
                    ml='xs'
                    mt='xl'
                >
                    <Group
                        spacing='xs'
                    >
                        Unsere Email-Addresse:
                        <Link
                                component="span"
                                path='mailto:schulshop@asg-er.de'
                                text={<Center>{mailIcon}schulshop@asg-er.de</Center>}
                                tooltip='Hier klicken, um direkt zu schreiben'
                            />
                    </Group>
                    <Group
                        spacing='xs'
                    >
                        oder in der Schule:
                        <Link
                                component="span"
                                text={<Center><BuildingStore />Raum A007</Center>}
                            />
                    </Group>
                </Text>
                <Button
                    mt='3rem'
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    <ArrowNarrowLeft />
                    Zurück zum Shop
                </Button>
            </Container>
        </Center>
    )
}