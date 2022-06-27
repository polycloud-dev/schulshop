import { Container, Text, Title } from '@mantine/core'
import { Mail } from 'tabler-icons-react'
import Link from "../components/link"

export default function ContactPage() {
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
                <Mail
                    size={'1.2rem'}
                />
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