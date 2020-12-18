const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const { client } = require('websocket');

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

let clients = {};

io.on('connection', (socket) => { 

    if(socket.handshake.headers.hasOwnProperty('x-client-id')) {
        clients[socket.handshake.headers['x-client-id']] = socket;
    }

    socket.on('new_log', (data) => {
        if(clients.hasOwnProperty('simulator')) {
            clients['simulator'].emit('drive_update', data);
        }
    });

    socket.on('create_vehicle', (data) => {
        if(clients.hasOwnProperty('python-script')) {
            clients['python-script'].emit('create_vehicle');
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id  + ' disconnected');
    });
});



server.listen(8080);