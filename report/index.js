const routes = require('./routes');

exports.assignRoutes = function (app) {
    app.use('/api', routes.apiRoutes);
}