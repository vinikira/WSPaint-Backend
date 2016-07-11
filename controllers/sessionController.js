(() =>{
  'use strict';
  let Session = require('../models/session.js');
  let sessionController = {
    retrieveOne: (io, id) => {
      Session.findOne({_id: id}, (err, data) => {
        if (err) return io.emit('error', err);
        return io.emit('refreshSession', data);
      });
    },
    retrieve: (socket, where) => {
      Session.find(where, (err, data) => {
        if (err) return io.emit('error', err);
        return socket.emit("sessions", data);
      });
    },
    save: (io, ws, session) => {
      let newSession = new Session(session);
      newSession.save((err, data) => {
        if (err) return ws.emit('error', err);
        ws.join(data._id);        
        return io.to(data._id).emit('refreshSession', data);
      });
    },
    update: (ws, id, modify) => {
      Session.update({_id: id},modify, (err, data) => {
          if (err)  return ws.emit('error', err);
          return ws.emit("refreshSession", data);
        });
      },
    delete: (ws, id)=> {
      Session.remove({_id: id}, (err, data) => {
        if (err) return ws.emit('error', err);
        return ws.emit("refreshSession", data);
      });
    },
    saveUser: (io, ws, id, user)=> {      
      Session.pushUserIfNotExists(id, user, (err, data)=>{
        if (err) return ws.emit('error',err);
        ws.join(data._id);
        return io.to(data._id).emit("refreshSession", data);
      });
    },
    putTrace: (ws, id, trace) =>{
      let where = {_id: id};
      let modify = {$push: {'draw': trace}, $inc: {__v:1}};
      let options = {safe: true, upsert:true, new:true};

      Session.findOneAndUpdate(where, modify, options, (err,data)=>{
        if (err) return ws.emit('error', err);
        Session.findOne(where, (err2, data2)=>{
          if (err) return ws.emit('error', err2);
          ws.to(data._id).emit("refreshSession", data2);
        });
      });
    }
  }
  module.exports = sessionController;
})();
