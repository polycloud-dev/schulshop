export default class LogClient {
    constructor(name) {
        this.name = name
    }
    static register(name) {
        return new LogClient(name)
    }
    log(msg) {
        const now = new Date();
        console.log(`[\x1b[36m${now.getDate()}.${now.getMonth()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[0m] [\x1b[32m${this.name}\x1b[0m] ${msg}`);
    }

    error(error) {
        const now = new Date();
        console.log(`[\x1b[36m${now.getDate()}.${now.getMonth()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[0m] [\x1b[32m${this.name}\x1b[0m] \x1b[31m${error}\x1b[0m`);
    }

    test(a, b, op='eq') {
        switch(op) {
            case 'eq': return console.log(`\x1b[36mtest: \x1b[33m${a}\x1b[36m === \x1b[33m${b}\x1b[36m -> ${(a === b) ? '\x1b[32mtrue' : '\x1b[31mfalse'}\x1b[0m`)
            case 'neq': return console.log(`\x1b[36mtest: \x1b[33m${a}\x1b[36m !== \x1b[33m${b}\x1b[36m -> ${(a !== b) ? '\x1b[32mtrue' : '\x1b[31mfalse'}\x1b[0m`)
        }
    }
}