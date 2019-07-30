//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var usersDB = require('../users/usersDB');
var configTest = require('./configTest');

chai.use(chaiHttp);
//Our parent block
describe('All tests', function () {

  before(function (done) {
    usersDB.User.remove({}, (err) => {
      usersDB.saveUser({
        "username": configTest.username,
        "password": configTest.password,
        "type": "voluntary"
      }).then(response => {
        response.should.be.an('object');
        expect(response.username, configTest.username);
        configTest.setUserId(response._id);
        done();
      }).catch(err => {
        console.error("Error found in login tests", err);
      });
    });
  });

  describe('Login', function () {
    require('./login');
  });
  describe('Users', function () {
    require('./users');
  });
  describe('Forum', function () {
    require('./forum');
  });
  describe('Advert', function () {
    require('./advert');
  });
  describe('Inscription', function () {
    require('./inscription');
  });
  describe('Likes/Dislikes', function () {
    require('./like');
  });
  describe('Report', function(){
    require('./report');
  });
})