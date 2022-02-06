const schedule = require('node-schedule');
const fetch = require('node-fetch');

const {LogClient} = require('./logger')
const logClient = LogClient.register('Scheduler');

const apiKey = "123";

schedule.scheduleJob('0 * * * * *', async () => {
    await fetch('http://app:3000/api/checkout/collect', {
        "method": "POST",
	    "headers": {"API-KEY": apiKey}
    });
    logClient.log('Schedule Job completed!');
});

logClient.log("Scheduler started!");