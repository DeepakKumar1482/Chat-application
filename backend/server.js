const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
server.listen(6000, () => {
    console.log('listening on 6000')
});