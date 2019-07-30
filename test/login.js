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
describe('POST /login', () => {
  it('should not login with a invalid user session', function (done) {
    chai.request(server)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ "username": configTest.username, "password": "passsss" })
      .end(function (err, res) {
        res.should.have.status(401);
        res.body.success.should.equal(false);
        res.body.message.should.equal("Authentication failed. Wrong password.");
        done();
      });
  });

  it('should login with a valid user session', function (done) {
    chai.request(server)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ "username": configTest.username, "password": configTest.password })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.success.should.equal(true);
        if (res.body.success) {
          configTest.setToken(res.body.token);
        } else {
          configTest.setToken(null);
        }
        done();
      });
  });
});

