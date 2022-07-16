import { Text, Container, Title, Space, Blockquote, Group } from "@mantine/core"
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
                    Die Produkte sollen individuell auf die jeweiligen Klassen zugeschnitten werden.
                    Das bedeutet, dass die Schülerinnen und Schüler bereits in den Sommerferien per Online-Shop ihre Unterlagen bestellen können,
                    ohne zu wissen, was sie überhaupt alles benötigen.
                    z.B. ein Schüler der jetzigen 6b weiß zwar,
                    dass er nächstes Schuljahr in der 7b sein wird, aber nicht,
                    welche Lehrer er bekommen wird und demnach auch nicht, welches Material er benötigen wird.
                    Der ASG-Schulshop erhält bereits im Juli die entsprechenden Daten, und kann individuelle Klassenpakete
                    (die auf jede Klasse zugeschnitten sind) erstellen. Diese können die Schülerinnen und Schüler schon vor Beginn des neuen Schuljahres bestellen.
                    Am ersten bzw. zweiten Schultag werden diese Pakete dann den entsprechenden Schülerinnen und Schülern in die Klassen geliefert.
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