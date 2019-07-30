const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

var options = {
  swaggerDefinition: {
    info: {
      title: 'IntegrApp BackEnd', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'BackEnd for IntegrApp platform'
    },
    basePath: '/api' // Base path (optional)
  },
  apis: ['./chat/*.js', './users/*', './forum/*', './advert/*', './inscription/*', './report/*'] // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);

exports.swaggerInit = function (app) {
  console.log("Swagger initialized");
  app.get('/api/api-docs.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
