module.exports = function(app, passport,models) {

    var api = require('./api.js')(models);
    var apix = require('./api/xero')(models);

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/partials/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    app.get('/partials/auth/:name', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),function (req, res) {
        var name = req.params.name;
        res.render('partials/auth/' + name);
    });

    app.post('/api/login', showClientRequest, passport.authenticate('local-login', {
        session: false
    }),api.login);

    app.post('/api/signup', showClientRequest, api.signup);


    app.get('/api/logout', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.logout);

    app.get('/api/payruns', showClientRequest, apix.getAllPayruns);

    app.get('/api/payruns/range', showClientRequest, apix.getAllPayrunsByDateRange);

    app.get('/api/payruns/employees/range', showClientRequest, apix.getPayrunsDetailWithEmployees);

    app.get('/api/payrun/:payrunId', showClientRequest, apix.getPayrunById);

    app.get('/api/employees', showClientRequest, apix.getAllEmployees);

    app.get('/api/employee/:employeeId', showClientRequest, apix.getEmployeeById);


   /*passport.authenticate('local-authorization', {
    session: false
    })*/


    function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
        console.log(request)
        return next();
    }
}