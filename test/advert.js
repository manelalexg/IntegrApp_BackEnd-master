//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var advertDB = require('../advert/advertDB');
var configTest = require('./configTest');

chai.use(chaiHttp);

var advert = {};
advert['userId'] = configTest.userId;
advert['createdAt'] = new Date().toLocaleString();
advert['date'] = new Date(2018, 6, 15, 12, 30, 0, 0).toLocaleString();
advert['state'] = "opened";
advert['title'] = 'Title1';
advert['description'] = "description1";
advert['places'] = 3;
advert['premium'] = false;
advert['typeUser'] = 'voluntary';
advert['typeAdvert'] = 'lookFor';

var advert2 = {};
advert2['userId'] = configTest.userId;
advert2['createdAt'] = new Date().toLocaleString();
advert2['date'] = new Date(2018, 6, 15, 12, 40, 0, 0).toLocaleString();
advert2['state'] = "opened";
advert2['title'] = 'Title2';
advert2['description'] = "description2";
advert2['places'] = 5;
advert2['premium'] = false;
advert2['typeUser'] = 'voluntary';
advert2['typeAdvert'] = 'lookFor';

var advert3 = {};
advert3['userId'] = configTest.userId;
advert3['createdAt'] = new Date().toLocaleString();
advert3['date'] = new Date(2018, 6, 15, 12, 50, 0, 0).toLocaleString();
advert3['state'] = "opened";
advert3['title'] = 'Title3';
advert3['description'] = "description3";
advert3['places'] = 10;
advert3['premium'] = false;
advert3['typeUser'] = 'voluntary';
advert3['typeAdvert'] = 'offer';

var mockAdverts = [];
mockAdverts.push(advert);
mockAdverts.push(advert2);
mockAdverts.push(advert3);

var advertIds = [];
describe('GET /advert', () => {

  before(function (done) {
    mockAdverts.forEach(element => {
      element.userId = configTest.userId;
    });
    advertDB.Advert.remove({}, (callback) => {
      advertDB.saveAdvert(mockAdverts[0])
        .then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[0].state);
          expect(res.userId, configTest.userId);
          expect(res.title, mockAdverts[0].title);
          expect(res.premium, mockAdverts[0].premium);
          expect(res.description, mockAdverts[0].description);
          advertIds.push(res.id);
          return advertDB.saveAdvert(mockAdverts[1]);
        }).then(response => {
          response.should.be.an("object");
          expect(response.userId, configTest.userId);
          expect(response.state, mockAdverts[1].state);
          expect(response.title, mockAdverts[1].title);
          expect(response.premium, mockAdverts[1].premium);
          expect(response.description, mockAdverts[1].description);
          advertIds.push(response.id);
          return advertDB.saveAdvert(mockAdverts[2]);
        }).then(res => {
          res.should.be.an("object");
          expect(res.userId, configTest.userId);
          expect(res.state, mockAdverts[2].state);
          expect(res.title, mockAdverts[2].title);
          expect(res.premium, mockAdverts[2].premium);
          expect(res.description, mockAdverts[2].description);
          advertIds.push(res.id);
          done();
        }).catch(err => {
          console.log("Error :", err.message);
        });
    })
  });

  it('it should not get any advert without token', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should get all the adverts without query', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        expect(res.body.length, 3);
        done();
      });
  });

  it('it should get all the adverts of type lookFor', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .query({ type: 'lookFor' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(2);
        res.body[0].should.have.property('user');
        res.body[1].should.have.property('user');
        done();
      });
  });

  it('it should get all the adverts of type offer', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .query({ type: 'offer' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(1);
        res.body[0].should.have.property('user');
        done();
      });
  });

  it('it should get all the adverts of type offer and lookFor', function (done) {
    chai.request(server)
      .get('/api/advert')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .query({ type: 'offer,lookFor' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.eql(3);
        res.body[0].should.have.property('user');
        res.body[1].should.have.property('user');
        res.body[2].should.have.property('user');
        done();
      });
  });

});

describe('POST /advert', () => {
  before(function (done) {
    advertDB.Advert.remove({}, (err) => {
      done();
    });
  });

  it('it should not create an advert without token', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "05-05-2018 13:20",
        "title": "title1",
        "description": "description",
        "places": 2,
        "typeAdvert": "lookFor"
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should create an advert with valid data (type=lookFor)', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "2018-09-05 13:20:30",
        "title": "title1",
        "description": "description",
        "places": 2,
        "typeAdvert": "lookFor"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        // console.log("ERROR", res.body.message);
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('date');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('places');
        res.body.should.have.property('typeAdvert');
        res.body.typeAdvert.should.be.eql('lookFor');
        done();
      });
  });

  it('it should create an advert with valid data (type=offer)', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "2018-09-05 13:20:00",
        "title": "title1",
        "description": "description",
        "places": 2,
        "typeAdvert": "offer"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('date');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('places');
        res.body.should.have.property('typeAdvert');
        res.body.typeAdvert.should.be.eql('offer');
        done();
      });
  });

  it('it should not create an advert with invalid date', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "Hello!",
        "title": "title1",
        "description": "description",
        "places": 2,
        "typeAdvert": "lookFor"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql("Date tiene que ser en formato YYYY-MM-DD hh:mm:ss");
        done();
      });
  });

  it('it should not create an advert with date before today', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "2018-01-05 13:20:00",
        "title": "title2",
        "description": "description1",
        "places": 2,
        "typeAdvert": "lookFor"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql("Date tiene que ser posterior a la date actual");
        done();
      });
  });

  it('it should not create an advert with 0 places', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "2018-05-05 13:20:00",
        "title": "title2",
        "description": "description1",
        "places": 0,
        "typeAdvert": "lookFor"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql("places tiene que ser mayor que 0");
        done();
      });
  });

  it('it should not create an advert with an invalid typeAdvert', (done) => {
    chai.request(server)
      .post('/api/advert/')
      .send({
        "date": "2018-05-05 13:20:00",
        "title": "title2",
        "description": "description1",
        "places": 5,
        "typeAdvert": "invalidOne"
      })
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql("type tiene que ser uno o varios de estos valores: [lookFor, offer]");
        done();
      });
  });
});

describe('DELETE /advert/{id}', () => {

  before(function (done) {
    advertIds = [];
    advertDB.Advert.remove({}, (callback) => {
      advertDB.saveAdvert(mockAdverts[0])
        .then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[0].state);
          expect(res.title, mockAdverts[0].title);
          expect(res.userId, configTest.userId);
          expect(res.premium, mockAdverts[0].premium);
          expect(res.description, mockAdverts[0].description);
          advertIds.push(res.id);
          return advertDB.saveAdvert(mockAdverts[1]);
        }).then(response => {
          response.should.be.an("object");
          expect(response.state, mockAdverts[1].state);
          expect(response.title, mockAdverts[1].title);
          expect(response.userId, configTest.userId);
          expect(response.premium, mockAdverts[1].premium);
          expect(response.description, mockAdverts[1].description);
          advertIds.push(response.id);
          return advertDB.saveAdvert(mockAdverts[2]);
        }).then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[2].state);
          expect(res.userId, configTest.userId);
          expect(res.title, mockAdverts[2].title);
          expect(res.premium, mockAdverts[2].premium);
          expect(res.description, mockAdverts[2].description);
          advertIds.push(res.id);
          return advertDB.getAdvert([]);
        }).then(all => {
          all.should.be.an('array');
          expect(all.length, 3);
          done();
        }).catch(err => {
          console.log("Error :", err.message);
        });
    });
  });

  it('it should not delete anything if there is no token', (done) => {
    chai.request(server)
      .del('/api/advert/' + advertIds[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should delete an advert', (done) => {
    chai.request(server)
      .del('/api/advert/' + advertIds[1])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql('Advert deleted');
        advertDB.getAdvert([]).then(all => {
          all.should.be.an('array');
          expect(all.length, 2);
          done();
        }).catch(err => {
          console.log("Error occured: ", err.message);
        })
      });
  });

  it('it should not delete an advert if the id is invalid', (done) => {
    chai.request(server)
      .del('/api/advert/invalid_Id')
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql('AdvertId invalid');
        advertDB.getAdvert([]).then(all => {
          all.should.be.an('array');
          expect(all.length, 2);
          done();
        }).catch(err => {
          console.log("Error occured: ", err.message);
        });
      });
  });
});

describe('GET /advertsUser', () => {

  before(function (done) {
    advertIds = [];
    advertDB.Advert.remove({}, (callback) => {
      advertDB.saveAdvert(mockAdverts[0])
        .then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[0].state);
          expect(res.userId, configTest.userId);
          expect(res.title, mockAdverts[0].title);
          expect(res.premium, mockAdverts[0].premium);
          expect(res.description, mockAdverts[0].description);
          advertIds.push(res.id);
          return advertDB.saveAdvert(mockAdverts[1]);
        }).then(response => {
          response.should.be.an("object");
          expect(response.state, mockAdverts[1].state);
          expect(response.title, mockAdverts[1].title);
          expect(response.premium, mockAdverts[1].premium);
          expect(response.description, mockAdverts[1].description);
          advertIds.push(response.id);
          return advertDB.saveAdvert(mockAdverts[2]);
        }).then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[2].state);
          expect(res.title, mockAdverts[2].title);
          expect(res.premium, mockAdverts[2].premium);
          expect(res.description, mockAdverts[2].description);
          advertIds.push(res.id);
          done();
        }).catch(err => {
          console.log("Error :", err.message);
        });
    });
  });

  it('it should not get any advert if there is no token', (done) => {
    chai.request(server)
      .get('/api/advertsUser/' + configTest.userId)
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should get all the adverts from the user', (done) => {
    chai.request(server)
      .get('/api/advertsUser/' + configTest.userId)
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        expect(res.body.lenght, 3);
        res.body.forEach(element => {
          expect(element.userId, configTest.userId);
        });
        done();
      });
  });

  it('it should get an empty array if the user doesnt have any adverts', (done) => {
    advertDB.Advert.remove({}, (callback) => {
      chai.request(server)
        .get('/api/advertsUser/' + configTest.userId)
        .set('Accept', 'application/json')
        .set('x-access-token', configTest.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body.lenght, 0);
          done();
        });
    });
  });
});

describe('PUT /advertState', () => {

  before(function (done) {
    advertIds = [];
    advertDB.Advert.remove({}, (callback) => {
      advertDB.saveAdvert(mockAdverts[0])
        .then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[0].state);
          expect(res.userId, configTest.userId);
          expect(res.title, mockAdverts[0].title);
          expect(res.premium, mockAdverts[0].premium);
          expect(res.description, mockAdverts[0].description);
          advertIds.push(res.id);
          return advertDB.saveAdvert(mockAdverts[1]);
        }).then(response => {
          response.should.be.an("object");
          expect(response.state, mockAdverts[1].state);
          expect(response.title, mockAdverts[1].title);
          expect(response.premium, mockAdverts[1].premium);
          expect(response.description, mockAdverts[1].description);
          advertIds.push(response.id);
          return advertDB.saveAdvert(mockAdverts[2]);
        }).then(res => {
          res.should.be.an("object");
          expect(res.state, mockAdverts[2].state);
          expect(res.title, mockAdverts[2].title);
          expect(res.premium, mockAdverts[2].premium);
          expect(res.description, mockAdverts[2].description);
          advertIds.push(res.id);
          done();
        }).catch(err => {
          console.log("Error :", err.message);
        });
    });
  });

  it('it should not modify any advert if there is no token', (done) => {
    chai.request(server)
      .put('/api/advertState/' + advertIds[0])
      .set('Accept', 'application/json')
      .send({ "state": "opened" })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('success');
        res.body.should.have.property('message');
        done();
      });
  });

  it('it should modify the state of the advert', (done) => {
    chai.request(server)
      .put('/api/advertState/' + advertIds[0])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "state": "opened" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('date');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('places');
        res.body.should.have.property('typeAdvert');
        res.body.typeAdvert.should.be.eql('lookFor');
        res.body.state.should.be.eql('opened');
        done();
      });
  });

  it('it should modify the state of the advert', (done) => {
    chai.request(server)
      .put('/api/advertState/' + advertIds[1])
      .set('Accept', 'application/json')
      .set('x-access-token', configTest.token)
      .send({ "state": "opened" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('date');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('places');
        res.body.should.have.property('typeAdvert');
        res.body.typeAdvert.should.be.eql('lookFor');
        res.body.state.should.be.eql('opened');
        done();
      });
  });
});