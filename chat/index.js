var tokenVerification = require('../middleware/tokenVerification');
const routesChat = require('./routes');
var chatDB = require('./chatDB');
var usersDB = require('../users/usersDB');

//https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender/10099325#10099325
exports.assignRoutes = function (app, server) {
  var io = require("socket.io").listen(server);
  var connectedUsers = {};

  io.sockets.on('connection', function (socket) {

    socket.on('send message', function (message, to) {
      console.log("Sending message: ", socket.userId + ' to ' + to + ': ' + message);
      var isNew = true;
      if (connectedUsers[to] != undefined) {
        isNew = false;
      }
      chatDB.saveChat(message, socket.userId, to, isNew, false).then(chatCreated => {
        if (connectedUsers[to] != undefined) {
          io.sockets.connected[connectedUsers[to].socketId].emit('new message', chatCreated);
        }
        if (socket.userId != to) {
          socket.emit('new message', chatCreated);
        }
        console.log("Created chat history:", chatCreated._id);
      }).catch(err => {
        console.log("ERROR: on socket chat", err);
      });
    });

    socket.on('new user', function (from, to, callback) { //TODO: podria enviarle todo el historial aqui...!
      console.log("New user connected:", from, to);
      if (from in connectedUsers) {
        callback(false);
      } else {
        usersDB.findUserById(from).then(user => {
          if (user) {
            usersDB.findUserById(to).then(userTo => {
              if (userTo) {
                socket.username = user.username;
                socket.userId = user._id;
                connectedUsers[socket.userId] = { 'username': socket.username, 'socketId': socket.id };
                // console.log("Socket:", from, to, socket.userId);
                chatDB.getChat(from, to).then(chats => {
                  callback({ success: true, userId: socket.userId, username: socket.username, chats: chats });
                }).catch(err => {
                  console.log("Error ocurred:", err);
                });
                chatDB.seenChats(from, to).then(result => {
                  console.log("Seen chats", result);
                  console.log("Sending old chats:", chats);
                }).catch(err => {
                  console.log("Error on seenChats", err);
                });
                updateNickNames();
              } else {
                callback({ success: false });
              }
            }).catch(err => {
              callback({ success: false });
            });
          } else {
            callback({ success: false });
          }
        }).catch(err => {
          callback({ success: false });
        });
      }
    });

    socket.on('disconnect', function (data) {
      if (!socket.userId) return;
      delete connectedUsers[socket.userId];
      updateNickNames();
    });

    function updateNickNames() {
      io.sockets.emit('usernames', connectedUsers);
    }
  });

  app.use('/api', routesChat.apiRoutes);
}