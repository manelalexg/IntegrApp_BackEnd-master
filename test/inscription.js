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
var advertDB = require('../advert/advertDB');

chai.use(chaiHttp);

var secondUserID = '';
var thirdUserID = '';
var advertId = '';

describe('POST /inscription', function () {
  before(function (done) {
    var mockAdvert = {};
    mockAdvert['userId'] = configTest.userId;
    mockAdvert['createdAt'] = new Date().toLocaleString();
    mockAdvert['date'] = new Date(2018, 6, 5).toLocaleString();
    mockAdvert['state'] = "opened";
    mockAdvert['title'] = "title";
    mockAdvert['description'] = "description";
    mockAdvert['places'] = 1;
    mockAdvert['premium'] = false;
    mockAdvert['typeUser'] = "voluntary";
    mockAdvert['typeAdvert'] = "lookFor";

    usersDB.saveUser({
      "username": "advertUsername",
      "password": "advertPassword",
      "type": "voluntary"
    }).then(response => {
      response.should.be.an('object');
      expect(response.username, configTest.username);
      secondUserID = response._id;
      return usersDB.saveUser({
        'username': "advertUsername2",
        "password": "password",
        "type": "voluntary"
      });
    }).then(res => {
      thirdUserID = res._id;
      return advertDB.saveAdvert(mockAdvert);
    }).then(res => {
      expect(res.title, "title");
      expect(res.description, "description");
      advertId = res._id;
      done();
    }).catch(err => {
      console.error("Error found in login tests", err);
    });
  });

  it('should register to a ad with invalid token', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .send({ "userId": secondUserID, "advertId": advertId })
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('should register to a ad with invalid data', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": "invalidOne" })
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('should register to a ad with invalid userId', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": "invalidOne", "advertId": advertId })
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('should register to a ad with invalid advertId', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": secondUserID, "advertId": "invalidOne" })
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('should register to a ad with valid data', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": secondUserID, "advertId": advertId })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('userId');
        res.body.should.have.property('advertId');
        res.body.should.have.property('status');
        done();
      });
  });

  it('should not register to a ad with valid data if it is registered', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": secondUserID, "advertId": advertId })
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('should not register to a ad with if he is the owner', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": configTest.userId, "advertId": advertId })
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');

        done();
      });
  });

  it('should register to a ad if there are no places', function (done) {
    chai.request(server)
      .post('/api/inscription')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "userId": thirdUserID, "advertId": advertId })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('userId');
        res.body.should.have.property('advertId');
        res.body.should.have.property('status');
        done();
      });
  });
});

describe('GET /inscription/{advertId}', function () {

  before(function (done) {
    var mockAdvert2 = {};
    mockAdvert2['userId'] = configTest.userId;
    mockAdvert2['createdAt'] = new Date().toLocaleString();
    mockAdvert2['date'] = new Date(2018, 6, 5).toLocaleString();
    mockAdvert2['state'] = "opened";
    mockAdvert2['title'] = "title";
    mockAdvert2['description'] = "description";
    mockAdvert2['places'] = 1;
    mockAdvert2['premium'] = false;
    mockAdvert2['typeUser'] = "voluntary";
    mockAdvert2['typeAdvert'] = "lookFor";

    advertDB.saveAdvert(mockAdvert2)
      .then(res => {
        expect(res.title, "title");
        expect(res.description, "description");
        advertId = res.id;
        chai.request(server).
          post('/api/inscription')
          .set('Accept', 'application/json')
          .set('x-access-token', configTest.token)
          .send({ "userId": secondUserID, "advertId": advertId })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('userId');
            res.body.should.have.property('advertId');
            res.body.should.have.property('status');
            done();
          });
      }).catch(err => {
        console.error("Error found in login tests", err);
      });
  });

  it('should not get the inscriptions without token', function (done) {
    chai.request(server)
      .get('/api/inscription/' + advertId)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('should get the inscriptions', function (done) {
    chai.request(server)
      .get('/api/inscription/' + advertId)
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        expect(res.body.length,1);
        res.body[0].should.have.property("userId");
        res.body[0].should.have.property("status");
        res.body[0].should.have.property("advertId");
        done();
      });
  });

  it('should not get the inscriptions if invalid id', function (done) {
    chai.request(server)
      .get('/api/inscription/' + "invalidOne")
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        done();
      });
  });
});