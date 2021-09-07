const express = require('express');
const process = require('process');
let serveIndex = require('serve-index');
const app = express();
let dir = '';


/***
 * Find local IP address
 * */
let ifaces = require('os').networkInterfaces();

// Iterate over interfaces ...
let adresses = Object.keys(ifaces).reduce(function (result, dev) {
    return result.concat(ifaces[dev].reduce(function (result, details) {
        return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
    }, []));
});


/***
 * Capture the first argument as the directory to serve
 * */
let myArgs = process.argv.slice(2);
if(myArgs.length > 0){
    dir = myArgs[0];
}
else{
    console.log('Please specify a directory to serve.');
    process.exit(1);
}


/***
 * Launch server with auto selected port
 * */
const server = app.listen(0, () => {
    console.log(`App serving directory: ${dir}`);
    console.log(`At address: http://${adresses.replace(/lo[0-9]/, '')}:${server.address().port}`)
});


/***
 * Serve directory as a static folder and allow browsing
 * */
app.use(express.json());
app.use(express.static(dir));
app.use('/', serveIndex(dir));
