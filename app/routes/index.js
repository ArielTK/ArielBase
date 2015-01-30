module.exports = function (app) {


    app.get('/', function (req, res) {
        res.render('index', {title: app.locals.title});
    });


};
