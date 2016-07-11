'use strict';
require('./config/db.js');
let desenhos = [];
let io = require('socket.io')(8080);
let sessionController = require('./controllers/sessionController.js');

io.on('connection', (socket)=>{
  console.log(`conexão do socket: ${socket.id}`);
  socket.emit('wellcome', {message: "Wellcome to the WSPaint!"});

  socket.on('newSession', (session)=>{
    sessionController.save(io, socket, session);
  }); 
  socket.on('loginSession', (user, id)=>{
    console.log(id);
    sessionController.saveUser(io, socket, id, user);
  });
  socket.on('getSession', (id)=>{
    sessionController.retrieveOne(io, id);
  });
  socket.on('getAllOpenedSessions', ()=>{
    sessionController.retrieve(socket, {opened: true});
  });
  socket.on('getAllSessions', ()=>{
    sessionController.retrieve(socket, {});
  });
  socket.on('putTraces', (id, traces)=>{
    console.log(id);
    sessionController.putTrace(io, id, traces);
  });
});
