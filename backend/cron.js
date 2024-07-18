const cron = require ('cron');
const https = require ('https');

const backendUrl = "https://attire-avenue-backend.onrender.com";

const job = new cron.CronJob('*/14 * * * *', function () {
    console.log('Restarting Server');

    https
    .get(backendUrl, (res) =>{
        if(res.statusCode === 200) {
            console.log('Server Restarted');
        } else{
            console.error(
                `failed to restart server with the server code: ${res.statusCode}`
            );
        }
    })
    .on('error' , (err) =>{
        console.error('Enter during Restart:', err.message);
    });
});

module.exports = {
    job,
};