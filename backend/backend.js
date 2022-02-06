const schedule = require('node-schedule');
const fetch = require('node-fetch');

const apiKey = "123";

schedule.scheduleJob('0 * * * * *', async () => {
    const res = await fetch('http://app:3000/api/checkout/collect', {
        "method": "POST",
	    "headers": {"API-KEY": apiKey}
    });
    console.log('Schedule Job completed!');
});

console.log("Scheduler started!");