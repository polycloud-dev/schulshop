import { Container, Text, Title } from '@mantine/core'
import { BrandAmongus, Mail } from 'tabler-icons-react'
import Link from "../components/link"
import { useState, useEffect } from 'react'

export default function ContactPage() {

    const [mailIcon, setMailIcon] = useState(<Mail size={'1.2rem'} />)

    useEffect(() => {
        if(Math.random() > 0.999) setMailIcon(<BrandAmongus size={'1.2rem'} />)
    }, [])

    return (
        <Container>
            <Title size='md'>Kontakt</Title>
            <Text>
                Hier können Sie uns kontaktieren.
            </Text>
            <Text
                mt='xl'
            >
                Unsere Mailadresse: {' '}
                {mailIcon}
                {' '}
                <Link
                    component="span"
                    path='mailto:schulshop@asg-er.de'
                    text='schulshop@asg-er.de'
                    tooltip='Hier klicken, um direkt zu schreiben'
                />
            </Text>
        </Container>
    )
}