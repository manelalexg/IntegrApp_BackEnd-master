//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var reportDB = require('../report/reportDB');
var configTest = require('./configTest');
var usersDB = require('../users/usersDB');
var advertDB = require('../advert/advertDB');

describe('POST /report', () => {

  var allUsersIds = [];
  var advertIds = [];
  before(done => {

      usersDB.saveUser({
        "username": "provaBis1",
        "password": "prova1",
        "type": "voluntary"
      }).then(response1 => {
        response1.should.be.an('object');
        expect(response1.username, "provaBis1");
        allUsersIds.push(response1._id);
        return usersDB.saveUser({
          "username": "provaBis2",
          "password": "prova2",
          "type": "voluntary"
        });
      }).then(response2 => {
        response2.should.be.an('object');
        expect(response2.username, "provaBis2");
        allUsersIds.push(response2._id);
        return usersDB.saveUser({
          "username": "provaBis3",
          "password": "prova3",
          "type": "voluntary"
        });
      }).then(response3 => {
        response3.should.be.an('object');
        expect(response3.username, "provaBis3");
        allUsersIds.push(response3._id);
        allUsersIds.length.should.be.eql(3);
        advertDB.Advert.find({}, (err, res) => {
          res.forEach(element => {
            advertIds.push(element._id);
          });
          advertIds.length.should.be.eql(5);
          done();
        });
      }).catch(err => {
        console.error("Error found in login tests", err);
      });
  });

  it('it should create a report from valid data', function (done) {
    chai.request(server)
      .post('/api/report')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "description": "Description report",
        "type": "user",
        "typeId": allUsersIds[0]
      })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.an('object');
        res.body.should.have.property('description');
        res.body.should.have.property('userId');
        res.body.should.have.property('type');
        res.body.should.have.property('createdAt');
        res.body.should.have.property('typeId');
        done();
      });
  });

  it('it should not create a report without token', function (done) {
    chai.request(server)
      .post('/api/report')
      .set('Accept', 'application/json')
      .send({
        "description": "Description report",
        "type": "user",
        "typeId": allUsersIds[1]
      })
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        res.body.should.have.property("success");
        done();
      });
  });

  it('it should not create a report from invalid data', function (done) {
    chai.request(server)
      .post('/api/report')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "description": "Description report",
        "type": "user"
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not create a report from invalid type [advert, user, forum]', function (done) {
    chai.request(server)
      .post('/api/report')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "description": "Description report",
        "type": "caca",
        "typeId": allUsersIds[1]
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not create a report from invalid typeId', function (done) {
    chai.request(server)
      .post('/api/report')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "description": "Description report",
        "type": "user",
        "typeId": "invalidOne"
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not create a report from a type=user and typeId inexistant', function (done) {
    chai.request(server)
      .post('/api/report')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "description": 'Description report',
        "type": 'user',
        "typeId": advertIds[0]
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

});