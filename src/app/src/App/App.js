import { Button, Text } from '@mantine/core';
import useStyles from './styles.js';

function App() {

    const { classes } = useStyles();

    return (
        <Text
            className={classes.text}
            align='center'
            mt={200}
        >
            Hello World!
            <Button>Click me!</Button>
        </Text>
    );
}

export default App;