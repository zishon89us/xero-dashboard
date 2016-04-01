module.exports = function (app, passport, models) {

    var user = require('./api/user')(models),
        xero = require('./api/xero')(models),
        exchange = require('./api/exchange')(models);

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/partials/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    app.get('/partials/auth/:name', showClientRequest, passport.authenticate('local-authorization', {
        session: true
    }), function (req, res) {
        var name = req.params.name;
        res.render('partials/auth/' + name);
    });

    app.post('/api/login', showClientRequest, usernameValid, passport.authenticate('local-login', {
        session: true
    }), user.login);

    app.post('/api/signup', showClientRequest, usernameValid, user.signup);


    app.get('/api/logout', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }), user.logout);

    app.get('/api/payruns', showClientRequest, xero.getAllPayruns);

    app.get('/api/payruns/range', showClientRequest, xero.getAllPayrunsByDateRange);

    app.get('/api/payruns/employees/range', showClientRequest, xero.getPayrunsDetailWithEmployees);

    app.get('/api/payrun/:payrunId', showClientRequest, xero.getPayrunById);

    app.get('/api/employees', showClientRequest, xero.getAllEmployees);

    app.get('/api/employee/:employeeId', showClientRequest, xero.getEmployeeById);

    app.get('/api/exchange/usd/pkr', showClientRequest, exchange.USDtoPKR);


    /*passport.authenticate('local-authorization', {
     session: false
     })*/


    function showClientRequest(req, res, next) {
        var request = {
            REQUEST: {
                HEADERS: req.headers,
                BODY: req.body
            }
        }
        console.log(request)
        return next();
    }

    /*sample validation, it could be extended but its kept simple for sample*/
    function usernameValid(req, res, next) {
        req.assert('username', '3 to 20 characters required').len(3, 20);

        var errors = req.validationErrors(); // Or req.asyncValidationErrors();
        if (errors.length) {
            res.status(422);
            res.send("username should be at 3-20 character long");
        }
        else
            return next();
    }
}