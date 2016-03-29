var XeroLib = require('xero-api'),
    q = require('q'),
    queryString = require('querystring'),
    moment = require('moment'),
    filterFormat = 'YYYY, MM, DD',
    config = require('../../config/auth');


//Authenticating with xero
var xero = new XeroLib(config.xero.CONSUMER_KEY,
    config.xero.CONSUMER_SECRET,
    config.xero.RSA_PRIVATE_KEY);


//XeroLayer sugar in promisified style :)
var XeroLayer = function () {

};

//Get specific payrun of given payrun_id
XeroLayer.prototype.payrun = function (payrun_id) {
    var deferred = q.defer();

    if (typeof payrun_id != "string")
        deferred.reject('Payrun Identifier must be string.');
    else
        xero.payroll('GET', '/Payruns/' + payrun_id, null, function (err, resp) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(resp);
        });

    return deferred.promise;
};

//Get all payruns
XeroLayer.prototype.payruns = function () {
    var deferred = q.defer();

    xero.payroll('GET', '/Payruns', null, function (err, resp) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(resp);
    });

    return deferred.promise;
};

//Get payruns by date range
XeroLayer.prototype.payrunsByDateRange = function (start_date, end_date) {
    var deferred = q.defer();

    if(!start_date && !end_date)
        start_date = moment((new Date()).toUTCString()).subtract(1, 'months').startOf('month').format(filterFormat);

    var filter = '';

    if (start_date)
        filter += 'PayRunPeriodStartDate >= DateTime(' + moment(start_date).format(filterFormat) + ')';
    if (start_date && end_date)
        filter += ' && ';
    if (end_date)
        filter += 'PayRunPeriodEndDate < DateTime(' + moment(end_date).format(filterFormat) + ')';

    xero.payroll('GET', '/Payruns?' + queryString.stringify({where: filter}), null, function (err, resp) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(resp);
    });

    return deferred.promise;
};

//Get all employees
XeroLayer.prototype.employees = function () {
    var deferred = q.defer();

    xero.payroll('GET', '/Employees', null, function (err, resp) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(resp);
    });

    return deferred.promise;
};

//Get specific employee of given employee_id
XeroLayer.prototype.employee = function (employee_id) {
    var deferred = q.defer();

    if (typeof employee_id != "string")
        deferred.reject('Employee Identifier must be string.');
    else
        xero.payroll('GET', '/Employees/' + employee_id, null, function (err, resp) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(resp);
        });

    return deferred.promise;
};

module.exports = new XeroLayer();

//console.log(moment('2010,12,12').format(filterFormat))