const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = {};

app.get('/', (req, res)=>{
  res.send('socketio.....');
});

io.on('connection', (socket)=>{
  console.log("nuevo socket conectado");

  socket.on('increment', (counter) =>{
    console.log("increment");
    io.sockets.emit("COUNTER_INCREMENT", counter+1);
  });
  
  socket.on('decrement', (counter) =>{
    console.log("decrement");
    io.sockets.emit("COUNTER_DECREMENT", counter-1);
  });
  //eventos chat
  socket.on('login',(username) =>{
    console.log('LOGUIN')
    if(users[username]){
      socket.emit("USER_EXISTS");
      return;
    }
    socket.username = username;
    users[username] = username;

    socket.emit("LOGIN",{
      username: socket.username,
      users
    });

    socket.broadcast.emit('USER_JOINED',{
      username: socket.username,
      users
    });

  });

  socket.on('newMessage',(message) =>{
    console.log('new Menssage');
    socket.broadcast.emit("NEW_MESSAGE",socket.username + ': ' + message);
    socket.emit('NEW_MESSAGE', 'Yo: '+ message ); 
  });

  socket.on('disconnect',()=>{
    console.log('LEFT')
    if(users[socket.username]){
       delete users[socket.username];
       socket.broadcast.emit('USER_LEFT',{
         username: socket.username,
         users
       });
    }
  });

});

http.listen(5000,()=>{
  console.log('listening on *:5000');
});

module.exports = app;