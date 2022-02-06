const schedule = require('node-schedule');
const fetch = require('node-fetch');

const apiKey = "123";

schedule.scheduleJob('0 * * * * *', async () => {
    const res = await fetch('http://localhost:3000/api/checkout/collect', {
        "method": "POST",
	    "headers": {"API-KEY": apiKey}
    });
    console.log('Job completed!');
});

console.log("Scheduler started!");