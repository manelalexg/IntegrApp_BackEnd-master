/**
 * Created by integrapp Team
 *
 * Based on SPAM Server dvicente@solidear.es on 09/06/2016
 */
'use strict';

// packages
var express = require('express');
var bodyparser = require('body-parser');
var db_tools = require('./tools/db_tools');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('config'); // get our config file
var path = require('path');
var http = require('http');
var cloudinary = require('cloudinary');
var upload = require('express-fileupload');

// module.exports para que sea visible por todos los lados
var app = module.exports = express();

if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('dev'));
}

// app.use(morgan('dev'));
app.use(upload());
app.set('superSecret', config.secret); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb' }));
app.use('/uploads',express.static('uploads'));

db_tools.DBConnectMongoose()
  .then(() => {
    var users = require('./users');
    var forums = require('./forum');
    var adverts = require('./advert');
    var inscriptions = require('./inscription');
    var reports = require('./report');
    var swagger = require('./swagger/swagger');
    var chat = require('./chat');

    app.use('/', express.static(__dirname + '/mainPage'));

    app.get('/api', function (req, res) {
      res.send("IntegrApp API Deployed!");
    });

    swagger.swaggerInit(app);

    users.assignRoutes(app);
    forums.assignRoutes(app);
    adverts.assignRoutes(app);
    inscriptions.assignRoutes(app);
    reports.assignRoutes(app);
    
    app.use('/chat', express.static(__dirname + '/chat/public'));
    
    var server = http.createServer(app);
    chat.assignRoutes(app,server);
    

    var port = process.env.PORT || 8080;
    server.listen(port);

    console.log('Server listening on port ' + port);
  }).catch(err => {
    console.log('Error: ' + err)
  });