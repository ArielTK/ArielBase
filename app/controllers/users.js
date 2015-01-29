/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
};

exports.signup = function (req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = new User(req.body);

    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;

    if (err) {
        return res.send(400, {
            message: getErrorMessage(err)
        });
    } else {
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;
        res.jsonp(user);

        /*
         req.login(user, function(err) {
         if (err) {
         res.send(400, err);
         } else {
         res.jsonp(user);
         }
         });*/
    }
    // Then save the user
    user.save(function (err) {
    });
};

exports.createMasterUser = function () {
    var masterUser = {
        firstName: 'Ariel',
        lastName: 'Dorani',
        username: 'Ariel',
        password: 'hellooo',
        provider: 'local',
        email: 'ariel@adi.com'
    };
    masterUser.displayName = masterUser.firstName + ' ' + masterUser.lastName;

    var user = new User(masterUser);
    user.save();
};
