module.exports = function (app) {

    var users = require('../controllers/users');

    /* GET users listing. */
    app.route('/users/')
        .get(function (req, res) {
            res.send('respond with a resource');
        });

    app.route('/users/:id/')
        .get(function (req, res) {

            res.send('respond with a resource: ' + req.params.id);
        });

};