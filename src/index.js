const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const public_dir_path = path.join(__dirname, '../public');

app.use(express.static(public_dir_path));


io.on('connection', (socket)=>{
    console.log('New websocket connection');


    socket.emit('message','welcome!');
    socket.broadcast.emit('message', 'A new user has joined');

    socket.on('sendMessage', (msg, callback)=>{
        io.emit('message',msg);
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left');
    })

    socket.on('sendLocation', (coordinates, callback)=>{
        gmaps_url = `https://google.com/maps?q=${coordinates.lat},${coordinates.long}`
        io.emit('message', gmaps_url);
        callback();
    })
})

server.listen(3000, ()=>{
    console.log('Listening on port 3000')
})

