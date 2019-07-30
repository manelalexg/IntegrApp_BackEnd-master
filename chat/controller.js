/**
 * Controller of chat
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var chatDB = require('./chatDB');

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

exports.getChatByUserId = function (req, res, next) {
  if(req.params.id == undefined){
    res.status(400).json({ message: "Id necesario"});
    return;
  }

  chatDB.getChatByUserId(req.params.id).then(chats => {
    res.send(chats);
  }).catch(err => {
    res.status(400).send(err);
  });
}

exports.getNewChats = function (req, res, next) {
  if(req.params.id == undefined){
    res.status(400).json({message: "Id necesario"});
    return;
  }
  chatDB.getNewChat(req.params.id).then(newChats =>{
    res.send(newChats);
  }).catch(err => {
    res.status(400).send(err);
  });
}

exports.getChat = function (req, res, next) {
  if (req.query.from == undefined || req.query.to == undefined) {
    res.status(400).json({ message: "Faltan parámetros: from y to." });
    return;
  }
  if (!req.query.from.match(/^[0-9a-fA-F]{24}$/) || !req.query.to.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({ message: "Alguno de los userId no son válidos" });
    return;
  }
  chatDB.getChat(req.query.from, req.query.to).then(chats => {
    res.send(chats);
  }).catch(err => {
    res.status(400).json({ message: err.message })
  });
}