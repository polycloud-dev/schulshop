import { Text, Container, Title, Space } from "@mantine/core"
import Logo from "../components/logo/logo"

export default function AboutPage() {
    return (
        <>            
            <Container
                mt='4rem'
                style={{
                    textAlign: "center",
                    maxWidth: "50rem",
                }}
            >
                <Logo size='10rem' />
                <Title
                    mt='2rem'
                    mb='lg'
                >
                    Das sind wir
                </Title>
                <Text
                    size='lg'
                >
                    Der Erwerb aller benötigten Schulmaterialien soll der Schulgemeinschaft einfach und kostengünstig zugänglich gemacht werden.
                    Dabei wird auf Nachhaltigkeit und regionale Geschäftspartner besonders geachtet.
                </Text>
                {/* <Group
                    mt='4rem'
                    position='center'
                >
                    <Blockquote
                        cite='- Tom'
                    >
                        Das ist eine wirklich gute Idee.
                    </Blockquote>
                    <Blockquote
                        cite='- Olaf'
                    >
                        Die Website sieht super aus.
                    </Blockquote>
                </Group> */}
                <Space h='2rem' />
            </Container>
        </>
    )
}