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
describe('POST /like/{userId} & POST /dislike/{userId}', () => {

  var likeUserIds = [];
  before(function(done){
    usersDB.saveUser({
      "username": "likeUser1",
      "password": "prova1",
      "type": "voluntary"
    }).then(response1 => {
      response1.should.be.an('object');
      expect(response1.username, "prova1");
      likeUserIds.push(response1._id);
      return usersDB.saveUser({
        "username": "likeUser2",
        "password": "prova2",
        "type": "voluntary"
      });
    }).then(response2 => {
      response2.should.be.an('object');
      expect(response2.username, "prova2");
      likeUserIds.push(response2._id);
      return usersDB.saveUser({
        "username": "likeUser3",
        "password": "prova3",
        "type": "voluntary"
      });
    }).then(response3 => {
      response3.should.be.an('object');
      expect(response3.username, "prova3");
      likeUserIds.push(response3._id);
      likeUserIds.length.should.be.eql(3);
      done();
    }).catch(err => {
      console.error("Error found in login tests", err);
    });
  });

  it('it should not like without token', function (done) {
    chai.request(server)
      .post('/api/like/' + likeUserIds[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should like a user', function (done) {
    chai.request(server)
      .post('/api/like/' + likeUserIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('rate');
        res.body.rate.should.have.property('likes');
        res.body.rate.should.have.property('dislikes');
        expect(res.body.rate.likes,1);
        done();
      });
  });

  var otherToken = "";
  it("login to another user", function(done){
    chai.request(server)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ "username": "likeUser1", "password": "prova1" })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.success.should.equal(true);
        otherToken = res.body.token;
        done();
      });
  });

  it('it should like a user', function (done) {
    chai.request(server)
      .post('/api/like/' + likeUserIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', otherToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('rate');
        res.body.rate.should.have.property('likes');
        res.body.rate.should.have.property('dislikes');
        expect(res.body.rate.likes,2);
        done();
      });
  });

  it('it should dislike a user', function (done) {
    chai.request(server)
      .post('/api/dislike/' + likeUserIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', otherToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('rate');
        res.body.rate.should.have.property('likes');
        res.body.rate.should.have.property('dislikes');
        expect(res.body.rate.likes,1);
        expect(res.body.rate.dislikes,1);
        done();
      });
  });

  it('it should dislike a user', function (done) {
    chai.request(server)
      .post('/api/dislike/' + likeUserIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('rate');
        res.body.rate.should.have.property('likes');
        res.body.rate.should.have.property('dislikes');
        expect(res.body.rate.likes,0);
        expect(res.body.rate.dislikes,2);
        done();
      });
  });

  it('it should dislike a user', function (done) {
    chai.request(server)
      .post('/api/dislike/' + likeUserIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('rate');
        res.body.rate.should.have.property('likes');
        res.body.rate.should.have.property('dislikes');
        expect(res.body.rate.likes,0);
        expect(res.body.rate.dislikes,2);
        done();
      });
  });

});

