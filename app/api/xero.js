module.exports = function(){

    var async = require('async');
    var xero = require('../../modules/accounting/xero'),
        util = require('../util/util');

    return {

        getAllPayruns: function (req,res) {

            xero.payruns().then(function(payruns){
                res.json(payruns);
            }).fail(function(err){
                res.send(500, {'message': err});
            });

        },

        //if no range given default to last month
        getAllPayrunsByDateRange: function (req,res) {

            xero.payrunsByDateRange(req.query.startDate, req.query.endDate).then(function(payruns){
                res.json(payruns);
            }).fail(function(err){
                res.send(500, {'message': err});
            });

        },

        getPayrunsDetailWithEmployees: function (req,res) {

            //doing in waterfall style
             async.waterfall([
                function (cb) {

                    //get payruns and employees in parallel
                    async.parallel({
                            payruns: function (callback) {
                                xero.payrunsByDateRange(req.query.startDate, req.query.endDate).then(function(payruns){
                                    console.log('payruns success');
                                    callback(null, payruns);
                                })/*.fail(function(err){
                                    console.log('payruns fail');
                                    callback(err, null);
                                })*/;
                            },
                            employees: function (callback) {
                                xero.employees().then(function(employees){
                                    console.log('employees success');
                                    callback(null, employees);
                                })/*.fail(function(err){
                                    console.log('employees fail');
                                    callback(err, null);
                                })*/;
                            }
                        },
                        function (err, results) {
                            console.log('employees payruns cb');
                            cb(null, results);
                        });
                },
                function (results, cb_) {

                    /*var payrunIds = results.payruns.Response.PayRuns.PayRun.map(function(obj){
                       return obj.PayRunID;
                    });
                    var employeeIds = results.employees.Response.Employees.Employee.map(function(obj){
                        return obj.EmployeeID;
                    });*/
                    var payrunIds = util.getPayrunIds(results.payruns.Response);
                    var employeeIds = util.getEmployeeIds(results.employees.Response);

                    async.parallel({
                            payrunsInDetail: function (callback) {
                                async.map(payrunIds, function(payrunId, cb){
                                    xero.payrun(payrunId).then(function(payrun){
                                        cb(null, payrun);
                                    }).fail(function(err){
                                        cb(err, null);
                                    });
                                }, callback);
                            },
                            employeesInDetail: function (callback) {
                                async.map(employeeIds, function(employeeId, cb){
                                    xero.employee(employeeId).then(function(employee){
                                        cb(null, employee);
                                    }).fail(function(err){
                                        cb(err, null);
                                    });
                                }, callback);
                            }
                        },
                        function (err, results) {
                            cb_(null, results);
                        });

                },
                function (results, callback) {
                    //format data
                    var response = {
                        payrun:util.getLatestPayrunOutOfRange(results.payrunsInDetail),
                        previousPayrun:util.getPreviousPayrunOutOfRange(results.payrunsInDetail),
                        employees:util.getEmployeesKeyVal(results.employeesInDetail, results.payrunsInDetail)
                    };
                     res.send(response)

                    //callback(null, finalResult);
                }
            ], function (err, result) {
                //do in-memory redis stuff
                //send results to client
            });


        },

        getAllPayrunsInDetail: function (req,res) {

            //to be handled
            /*xero.payruns().then(function(payruns){
                res.json(payruns);
            }).fail(function(err){
                res.send(500, {'message': err});
            });*/

        },

        getPayrunById: function (req,res) {

            xero.payrun(req.params.payrunId).then(function(payruns){
                res.json(payruns);
            }).fail(function(err){
                res.send(500, {'message': err});
            });

        },

        getAllEmployees: function (req,res) {

            xero.employees().then(function(employees){
                res.json(employees);
            }).fail(function(err){
                res.send(500, {'message': err});
            });

        },

        getEmployeeById: function (req,res) {

            xero.employee(req.params.employeeId).then(function(employee){
                res.json(employee);
            }).fail(function(err){
                res.send(500, {'message': err});
            });

        }
    }

}



