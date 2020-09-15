var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});

const httpsServer = https.createServer(credentials, app);

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000)
console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
