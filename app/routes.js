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

    //----------------dummy------------------------------------
    var dummyData = {
        "PayRunID": "55eda29f-a659-4092-854d-491129d7bf0d",
        "PayScheduleID": "57c61052-1aed-4ef3-aa25-76e44c24c949",
        "PayRunPeriodStartDate": "2016-07-14T00:00:00+12:00",
        "PayRunPeriodEndDate": "2016-07-28T00:00:00+12:00",
        "PaymentDate": "2016-07-31T00:00:00+12:00",
        "Earnings": 4583.33,
        "Deductions": 317.92,
        "Tax": 674.84,
        "Reimbursement": 0.0,
        "NetPay": 3590.57,
        "PayRunStatus": "DRAFT",
        "UpdatedDateUTC": "2016-05-25T19:31:19+12:00",
        "Paystubs": [
            {
                "Employee": {
                    "EmployeeID": "59cc56b3-8012-452b-ae31-b0f429e4bbdf",
                    "FirstName": "Graeme",
                    "LastName": "Biddle",
                    "JobTitle": "Sales Manager",
                    "Status": "ACTIVE",
                    "Email": "graeme.biddle@test.com",
                    "DateOfBirth": "1970-09-08T00:00:00+12:00",
                    "Gender": "M",
                    "HomeAddress": {
                        "StreetAddress": "44 Fillmore St",
                        "City": "San Francisco",
                        "State": "CA",
                        "Zip": "94117",
                        "Latitude": 37.76995,
                        "Longitude": -122.42995
                    },
                    "MailingAddress": {
                        "StreetAddress": "44 Fillmore St",
                        "City": "San Francisco",
                        "State": "CA",
                        "Zip": "94117",
                        "Latitude": 37.76995,
                        "Longitude": -122.42995
                    },
                    "Phone": "415-111-1111",
                    "SocialSecurityNumber": "***-**-9999",
                    "StartDate": "2016-02-01T00:00:00+13:00",
                    "PayScheduleID": "57c61052-1aed-4ef3-aa25-76e44c24c949",
                    "EmploymentBasis": "FULLTIME",
                    "HolidayGroupID": "3c5afcbd-ab01-49ac-8f22-62d716d8f58b",
                    "UpdatedDateUTC": "2016-05-25T19:40:45+12:00",
                    "IsAuthorisedToApproveTimeOff": true,
                    "IsAuthorisedToApproveTimesheets": true,
                    "SalaryAndWages": [
                        {
                            "SalaryAndWagesID": "2c8a7809-ff8c-4ce4-8566-01d6a71483b9",
                            "EarningsTypeID": "fdcee3a1-101f-476a-8d2e-49374b3bac24",
                            "SalaryWagesType": "SALARY",
                            "AnnualSalary": 60000.0,
                            "StandardHoursPerWeek": 40.0,
                            "PayStatus": "ACTIVE"
                        }
                    ],
                    "WorkLocations": [
                        {
                            "WorkLocationID": "c7ee8753-ab35-49de-90df-f086494539c4",
                            "IsPrimary": true
                        }
                    ],
                    "PaymentMethod": {
                        "PaymentMethodType": "CHECK"
                    },
                    "PayTemplate": {
                        "EarningsLines": [],
                        "DeductionLines": [
                            {
                                "DeductionTypeID": "93b67c9d-409b-4e6b-8044-6ef5ed0d9cd7",
                                "CalculationType": "FIXEDAMOUNT",
                                "Amount": 100.0
                            },
                            {
                                "DeductionTypeID": "761ff48b-538e-450c-b051-65532d3bd11b",
                                "CalculationType": "FIXEDAMOUNT",
                                "Amount": 72.5
                            }
                        ],
                        "ReimbursementLines": [],
                        "BenefitLines": [
                            {
                                "BenefitTypeID": "5a9e7027-3cc4-4e86-8fc3-ed784b9c8a7c",
                                "CalculationType": "FIXEDAMOUNT",
                                "Amount": 150.0
                            }
                        ]
                    },
                    "OpeningBalances": {
                        "EarningsLines": [],
                        "BenefitLines": [],
                        "DeductionLines": [],
                        "ReimbursementLines": []
                    },
                    "TimeOffBalances": [
                        {
                            "TimeOffName": "PTO",
                            "TimeOffTypeID": "25cc12c0-98bf-4605-a76f-79c714131107",
                            "NumberOfUnits": 10.67,
                            "TypeOfUnits": "Hours"
                        }
                    ]
                },
                "PaystubID": "586d32fb-1eac-4541-a424-848c18bc0012",
                "FirstName": "Graeme",
                "LastName": "Biddle",
                "Earnings": 2500.0,
                "Deductions": 172.5,
                "Tax": 391.69,
                "Reimbursements": 0.0,
                "NetPay": 1935.81,
                "UpdatedDateUTC": "2016-05-25T19:31:19+12:00"
            },
            {
                "Employee": {
                    "EmployeeID": "5546149c-d8e1-43c5-8340-2022d0fd2c26",
                    "FirstName": "Rachel",
                    "LastName": "Brown",
                    "JobTitle": "Accounts",
                    "Status": "ACTIVE",
                    "Email": "rachel.brown@test.com",
                    "DateOfBirth": "1982-10-09T00:00:00+13:00",
                    "Gender": "F",
                    "HomeAddress": {
                        "StreetAddress": "491 Glendora Dr",
                        "City": "San Mateo",
                        "State": "CA",
                        "Zip": "94403",
                        "Latitude": 37.52835,
                        "Longitude": -122.32625
                    },
                    "MailingAddress": {
                        "StreetAddress": "491 Glendora Dr",
                        "City": "San Mateo",
                        "State": "CA",
                        "Zip": "94403",
                        "Latitude": 37.52835,
                        "Longitude": -122.32625
                    },
                    "Phone": "408-999-1212",
                    "SocialSecurityNumber": "***-**-1000",
                    "StartDate": "2016-05-02T00:00:00+12:00",
                    "PayScheduleID": "57c61052-1aed-4ef3-aa25-76e44c24c949",
                    "EmploymentBasis": "FULLTIME",
                    "HolidayGroupID": "3c5afcbd-ab01-49ac-8f22-62d716d8f58b",
                    "UpdatedDateUTC": "2016-05-25T19:41:06+12:00",
                    "SalaryAndWages": [
                        {
                            "SalaryAndWagesID": "9d81bdc2-b13c-4708-af99-5feb6bb6d13b",
                            "EarningsTypeID": "fdcee3a1-101f-476a-8d2e-49374b3bac24",
                            "SalaryWagesType": "SALARY",
                            "AnnualSalary": 50000.0,
                            "StandardHoursPerWeek": 40.0,
                            "PayStatus": "ACTIVE"
                        }
                    ],
                    "WorkLocations": [
                        {
                            "WorkLocationID": "c7ee8753-ab35-49de-90df-f086494539c4",
                            "IsPrimary": true
                        }
                    ],
                    "PaymentMethod": {
                        "PaymentMethodType": "CHECK"
                    },
                    "PayTemplate": {
                        "EarningsLines": [],
                        "DeductionLines": [
                            {
                                "DeductionTypeID": "93b67c9d-409b-4e6b-8044-6ef5ed0d9cd7",
                                "CalculationType": "PERCENTAGEOFGROSS",
                                "Percentage": 5.0
                            },
                            {
                                "DeductionTypeID": "761ff48b-538e-450c-b051-65532d3bd11b",
                                "CalculationType": "FIXEDAMOUNT",
                                "Amount": 41.25
                            }
                        ],
                        "ReimbursementLines": [],
                        "BenefitLines": [
                            {
                                "BenefitTypeID": "5a9e7027-3cc4-4e86-8fc3-ed784b9c8a7c",
                                "CalculationType": "FIXEDAMOUNT",
                                "Amount": 75.0
                            }
                        ]
                    },
                    "OpeningBalances": {
                        "EarningsLines": [],
                        "BenefitLines": [],
                        "DeductionLines": [],
                        "ReimbursementLines": []
                    },
                    "TimeOffBalances": [
                        {
                            "TimeOffName": "PTO",
                            "TimeOffTypeID": "25cc12c0-98bf-4605-a76f-79c714131107",
                            "NumberOfUnits": -26.67,
                            "TypeOfUnits": "Hours"
                        }
                    ]
                } ,
                "PaystubID": "14cf443b-0d0e-4fa1-b306-35e2dc9e7efc",
                "FirstName": "Rachel",
                "LastName": "Brown",
                "Earnings": 2083.33,
                "Deductions": 145.42,
                "Tax": 283.15,
                "Reimbursements": 0.0,
                "NetPay": 1654.76,
                "UpdatedDateUTC": "2016-05-25T19:31:19+12:00"
            }
        ]
    };

    app.get('/api/payruns', function(req, res){
        res.send(dummyData);
    });

    app.get('/api/payruns/range', function(req, res){
        res.send(dummyData);
    });
    //----------------dummy------------------------------------

    app.get('/api/test', showClientRequest, apix.getPayrunsDetailWithEmployees);
/*    app.get('/api/payruns', showClientRequest, apix.getAllPayruns);
    app.get('/api/payruns/range', showClientRequest, apix.getAllPayrunsByDateRange);
    app.get('/api/payrun/:payrunId', showClientRequest, apix.getPayrunById);
    app.get('/api/employees', showClientRequest, apix.getAllEmployees);
    app.get('/api/employee/:employeeId', showClientRequest, apix.getEmployeeById);*/


/*    app.get('/api/people', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.getPeople);*/



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