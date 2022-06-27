import { Modal, Text, Container, Title, Button, Tooltip } from '@mantine/core'
import { useState } from 'react'
import Link from './link';
import { ArrowUpRight } from 'tabler-icons-react';

export default function HelpMenu() {
    
    const [isHover, setIsHover] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Modal
                opened={isOpen}
                onClose={() => setIsOpen(false)}
                withCloseButton={false}
            >
                <Container
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <Title
                        size='md'
                        mb='md'
                    >
                        Kleine Hilfe
                    </Title>
                    <Text>
                        Es gibt verschiedene Pakete: <br/>
                        Für die 5-6. Klasse gibt es speziell zugeschnittene Pakete, 
                        mit allem was diese jewilige Klasse benötigt.
                        Außerdem gibt es noch Standardpakete mit einer Auswahl von
                        verschiedenen Heften. <br/>
                        Alle Pakete können im Warenkorb bearbeitet werden.
                        Einzelne Produkte können auch bestellt werden.
                    </Text>
                    <Button
                        mt='xl'
                        onClick={() => setIsOpen(false)}
                    >
                        Ok, hab's verstanden
                    </Button>
                    <Link color='dimmed' text='Für weitere Fragen' path='/kontakt' />
                </Container>
            </Modal>
            <Tooltip
                label={<Text style={{display: 'flex', fontSize: '.8rem'}}>Hier gibts Hilfe<ArrowUpRight size={15} style={{margin: 'auto 0'}} /></Text>}
                withArrow
            >
                <Text
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={() => setIsOpen(true)}
                    style={{
                        textDecoration: isHover ? 'underline' : 'none',
                        cursor: 'pointer',
                    }}
                >
                    Hilfe
                </Text>
            </Tooltip>
        </>
    )
}