const schedule = require('node-schedule');
const fetch = require('node-fetch');

import LogClient from '../backend/logger'
const logClient = LogClient.register('SessionManager');

const apiKey = "123";

schedule.scheduleJob('0 * * * * *', async () => {
    const res = await fetch('http://app:3000/api/checkout/collect', {
        "method": "POST",
	    "headers": {"API-KEY": apiKey}
    });
    logClient.log('Schedule Job completed!');
});

logClient.log("Scheduler started!");