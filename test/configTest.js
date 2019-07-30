const username = "integrapp";
const password = "integrappTest";
var token = '';
var userId = '';

exports.username = username;
exports.password = password;
exports.token = token;
exports.userId = userId;

exports.setToken = function(token){
  this.token = token;
}

exports.setUserId = function(userId){
  this.userId = userId;
}