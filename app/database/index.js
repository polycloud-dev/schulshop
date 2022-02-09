import LogClient from '../backend/logger';
const logClient = new LogClient('Database-Client')

const fetch = require('node-fetch');

const minutes = 10;

var buffered = {};
var lastBuffered;

function buffer() {
    return new Promise(async resolve => {
        try {
            logClient.log('buffering database!')
            const res = await fetch('http://database:3000/');
            if(!res) {
                logClient.error(`cannot connect to database!`);
                setTimeout(buffer, 1000)
                return resolve();
            }
            const json = await res.json()
            buffered = json
            lastBuffered = new Date()
            resolve(json);
        }catch(e) {
            logClient.error(`cannot connect to database!`);
            setTimeout(buffer, 1000)
            return resolve();
        }
    })
}
buffer();

export default function dbGet(key) {
    return new Promise(async resolve => {
        const expired = lastBuffered ? new Date(lastBuffered.getTime()) : undefined
        if(expired) expired.setMinutes(expired.getMinutes() + minutes)
        if(!expired || expired.getTime() <= new Date().getTime()) await buffer()
        return resolve(buffered[key])
    })
};