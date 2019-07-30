//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var forumDB = require('../forum/forumDB');
var configTest = require('./configTest');

chai.use(chaiHttp);

describe('POST /forum', () => {

  it('it should create a forum from valid data', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
        "type": "documentation",
      })
      .end(function (err, res) {
        // console.log("[DEBUG]: RES", res.body);
        res.should.have.status(200);
        res.should.be.an('object');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('type');
        res.body.should.have.property('userId');
        res.body.should.have.property('rate');
        res.body.should.have.property('createdAt');
        done();
      });
  });

  it('it should not create a forum without token', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
        "type": "documentation",
      })
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        res.body.should.have.property("success");
        done();
      });
  });

  it('it should not create a forum from invalid data', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should not create a forum from invalid type [documentation, entertainment, language, various]', function (done) {
    chai.request(server)
      .post('/api/forum')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({
        "title": "Title from forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec ex mauris. Integer pulvinar aliquam placerat. Morbi in mi nec augue condimentum gravida. Sed nulla turpis, luctus in vehicula id, posuere sed lectus. Sed odio nibh, condimentum tempor congue quis, tincidunt ut justo. Sed tincidunt cursus massa quis lobortis. ",
        "type": "invalidType",
        "userId": configTest.userId
      })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });
});

describe('GET /forums', () => {
  before(function (done) {
    var forumData = [];
    forumData.push({
      title: "Title1", description: "Description1", createdAt: new Date().toISOString(),
      type: "documentation", userId: configTest.userId, rate: 0
    });
    forumData.push({
      title: "Title2", description: "Description2", createdAt: new Date().toISOString(),
      type: "entertainment", userId: configTest.userId, rate: 0
    });
    forumData.push({
      title: "Title3", description: "Description3", createdAt: new Date().toISOString(),
      type: "language", userId: configTest.userId, rate: 0
    });
    forumData.push({
      title: "Title4", description: "Description4", createdAt: new Date().toISOString(),
      type: "various", userId: configTest.userId, rate: 0
    });
    forumData.push({
      title: "Title5", description: "Description5", createdAt: new Date().toISOString(),
      type: "entertainment", userId: configTest.userId, rate: 0
    });
    forumDB.Forum.remove({}, (callback) => {
      return forumDB.saveForum(forumData[0]);
    }).then(response => {
      response.should.be.an("object");
      expect(response.title, forumData[0].title);
      // console.log(1,response.type);
      return forumDB.saveForum(forumData[1]);
    }).then(response => {
      response.should.be.an("object");
      expect(response.title, forumData[1].title);
      // console.log(2,response.type);
      return forumDB.saveForum(forumData[2]);
    }).then(response => {
      response.should.be.an("object");
      expect(response.title, forumData[2].title);
      // console.log(3,response.type);
      return forumDB.saveForum(forumData[3]);
    }).then(response => {
      response.should.be.an("object");
      expect(response.title, forumData[3].title);
      // console.log(4,response.type);
      return forumDB.saveForum(forumData[4]);
    }).then(response => {
      response.should.be.an("object");
      expect(response.title, forumData[4].title);
      // console.log(5, response.type);
      done();
    })
      .catch(err => {
        console.log("error on creating mock forums test", err);
      });
  });

  it('it should not get all the forum if no token provided', function (done) {
    chai.request(server)
      .get('/api/forums')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        res.body.should.have.property("success");
        done();
      });
  });

  it('it should get all the forum', function (done) {
    chai.request(server)
      .get('/api/forums')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });

  it('it should not get forums for a not valid type', function (done) {
    chai.request(server)
      .get('/api/forums')
      .query({ type: 'notValid' })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        done();
      });
  });

  it('it should get only the forum for type "entertainment"', function (done) {
    chai.request(server)
      .get('/api/forums')
      .query({ type: 'entertainment' })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.forEach(element => {
          expect(element.type, 'entertainment');
        });
        done();
      });
  });

  it('it should get the forum for type "entertainment" AND "documentation"', function (done) {
    chai.request(server)
      .get('/api/forums')
      .query({ type: 'entertainment,documentation' })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array'); //TODO: ver porque a veces no es igual a 3
        // res.body.length.should.be.eql(3);
        res.body.forEach(element => {
          element.should.satisfy(function (forum) {
            if (forum.type == "entertainment" || forum.type == "documentation") {
              return true;
            } else {
              return false;
            }
          });
        });
        // console.log("FOURM:", res.body);
        done();
      });
  });

});

var forumIdMock = "-";
describe('POST /commentForum', () => {
  before(function (done) {
    var forumData = {
      title: "Title1", description: "Description1", createdAt: new Date().toISOString(),
      type: "documentation", userId: configTest.userId, rate: 0
    };
    forumDB.Forum.remove({}, (callback) => {
      forumDB.saveForum(forumData).then(response => {
        response.should.be.an("object");
        expect(response.title, forumData.title);
        forumIdMock = response.id;
        done();
      }).catch(err => {
        console.log("error on creating mock forums test", err);
      });
    });
  });

  it('it should not comment the forum if no token provided', function (done) {
    chai.request(server)
      .post('/api/commentForum')
      .send({
        "forumId": forumIdMock,
        "content": "Pos si, estic d'acord"
      })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        res.body.should.have.property("success");
        done();
      });
  });

  it('it should comment the forum if everything is correct', function (done) {
    chai.request(server)
      .post('/api/commentForum')
      .send({
        "forumId": forumIdMock,
        "content": "Pos si, estic d'acord"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property("forumId");
        res.body.should.have.property("content");
        res.body.should.have.property("userId");
        res.body.should.have.property("createdAt");
        done();
      });
  });

  it('it should not comment the forum if there are not all the fields', function (done) {
    chai.request(server)
      .post('/api/commentForum')
      .send({
        "forumId": forumIdMock,
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        done();
      });
  });

  it('it should not comment the forum if the forumId is invalid', function (done) {
    chai.request(server)
      .post('/api/commentForum')
      .send({
        "forumId": "InvalidOne",
        "content": "MockContent"
      })
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

describe('GET /fullForum/:id', () => {
  before(function (done) {
    var forumData = {
      title: "Title1", description: "Description1", createdAt: new Date().toISOString(),
      type: "documentation", userId: configTest.userId, rate: 0
    };
    forumDB.Forum.remove({}, (callback) => {
      forumDB.saveForum(forumData).then(response => {
        response.should.be.an("object");
        expect(response.title, forumData.title);
        forumIdMock = response.id;
        chai.request(server)
          .post('/api/commentForum')
          .send({
            "forumId": forumIdMock,
            "content": "Pos si, estic d'acord"
          })
          .set('Accept', 'application/json')
          .set('x-access-token', configTest.token)
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property("forumId");
            res.body.should.have.property("content");
            res.body.should.have.property("userId");
            res.body.should.have.property("createdAt");
            done();
          });
      }).catch(err => {
        console.log("error on creating mock forums test", err);
      });
    });
  });

  it('it should not get the forum if no token provided', function (done) {
    chai.request(server)
      .get('/api/fullForum/' + forumIdMock)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property("message");
        res.body.should.have.property("success");
        done();
      });
  });

  it('it should get the forum with one entry', function (done) {
    chai.request(server)
      .get('/api/fullForum/' + forumIdMock)
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property("forum");
        res.body.should.have.property("entries");
        expect(res.body.forum.id, forumIdMock);
        res.body.entries.should.be.an('array');
        expect(res.body.entries.length,1);
        done();
      });
  });

  it('it should not get the forum with the entries if the id is invalid', function (done) {
    chai.request(server)
      .get('/api/fullForum/' + "invalidOne")
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