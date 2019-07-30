'use strict'

var mongoose = require('mongoose');
var config = require('config');

var db;

exports.DBConnectMongoose = function () {
  return new Promise(function (resolve, reject) {
    if (db) {
      return db;
    }
    mongoose.Promise = global.Promise;

    // database connect //mongodb://<dbuser>:<dbpassword>@ds157528.mlab.com:57528/integrapp
    mongoose.connect('mongodb://' + config.db_config.user + ':' + config.db_config.user + '@' + config.db_config.host + ":" + config.db_config.port + "/" + config.db_config.name)
      .then(() => {
        console.log('mongo connection created');
        resolve(db);
      })
      .catch(err => {
        console.log('error creating db connection: ' + err);
        reject(db);
      });
  });
};

exports.getDBConexion = function () {
  if (db) {
    console.log("Getting db");
    return db;
  }
  console.log('There is no mongo connection');
  return null;
}