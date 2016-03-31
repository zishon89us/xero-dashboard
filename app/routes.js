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

    app.get('/api/exchange/usd/pkr', showClientRequest, function(req, res){

        var request = require('request');
        request('https://openexchangerates.org/api/latest.json?app_id=1c5fc79208b94e49ae91ca52b2fea1d7', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                res.send({PKR: json.rates.PKR});
            }else{
                res.send({message:"exchange not found"});
            }

        })

        request
            .get('https://openexchangerates.org/api/latest.json?app_id=1c5fc79208b94e49ae91ca52b2fea1d7')
            .on('error', function(err) {
                console.log(err)
            })

    });



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