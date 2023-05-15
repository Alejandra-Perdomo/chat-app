const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const app = express();
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const public_dir_path = path.join(__dirname, '../public');

app.use(express.static(public_dir_path));


io.on('connection', (socket)=>{

    //socket.emit --> sends event to a specific client
    //io.emit --> sends event to every connected client
    //socket.broadcast.emit --> sends event to every connected client except for the one the event is about. 
    //socket.broadcast.to, io.to.emit --> sends event to everyone in a specific room, or everyone except one in a specific room. 

    console.log('New websocket connection');

    socket.on('join', ({username, room}, callback)=>{  /* or options instead of {username, room}*/
        socket.join(room);
        const {error, user} = addUser({ id: socket.id, username, room }); // destructure as ...options

        if(error){
            return callback(error);
        }

        socket.emit('message', generateMessage('Admin','Welcome!'));
        //socket.broadcast.emit('message', generateMessage('A new user has joined'));
        socket.broadcast.to(room).emit('message', generateMessage('Admin',`${username} has joined!`));

        callback();

    })

    socket.on('sendMessage', (msg, callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message',generateMessage(user.username,msg));

        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left.`));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (coordinates, callback)=>{
        const user = getUser(socket.id);
        gmaps_url = `https://google.com/maps?q=${coordinates.lat},${coordinates.long}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, gmaps_url));
        callback();
    })
})

server.listen(3000, ()=>{
    console.log('Listening on port 3000')
})

