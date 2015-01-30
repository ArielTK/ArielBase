module.exports = function (app) {
    var users = require('../controllers/users');

    app.route('/login/')
        .get(function (req, res) {
            res.render('login', {title: app.locals.title});
        })
        .post(users.signin);

    app.route('/logout/').get(users.signout);


};
