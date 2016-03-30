
module.exports = {

    'getPayrunIds': function(response){

        var result = [];

        //check if nothing is returned
        if(!response.PayRuns)
            return result;

        //check if array is returned
        if(typeof response.PayRuns.PayRun.map == "function"){
            result = response.PayRuns.PayRun.map(function(obj){
                return obj.PayRunID;
            });
            return result;
        }
        //check if object is returned
        if(typeof response.PayRuns.PayRun == "object" && typeof response.PayRuns.PayRun.map == "undefined"){
            result = [response.PayRuns.PayRun.PayRunID];
            return result;
        }

        return result;
    },
    'getLatestPayrunOutOfRange':function(payruns){
        return payruns.length ? payruns[0].Response.PayRuns.PayRun : "No Data Returned from Xero API";
    },
    'getPreviousPayrunOutOfRange':function(payruns){
        return payruns.length > 1 ? payruns[1].Response.PayRuns.PayRun : "No Data Returned from Xero API";
    },
    'getEmployeeIds': function(response){

        var result = [];

        //check if nothing is returned
        if(!response.Employees)
            return result;

        //check if array is returned
        if(typeof response.Employees.Employee.map == "function"){
            result = response.Employees.Employee.map(function(obj){
                return obj.EmployeeID;
            });
            return result;
        }
        //check if object is returned
        if(typeof response.Employees.Employee == "object" && typeof response.Employees.Employee.map == "undefined"){
            result = [response.Employees.Employee.EmployeeID];
            return result;
        }

        return result;
    },
    'getEmployeesKeyVal':function(employees, payruns){
        var result = {};
        if(employees.length){
            for(var i in employees){
                var tEmp = employees[i].Response.Employees.Employee;
                result[tEmp.EmployeeID] = tEmp;
            }
            //extract previous month netpay
            if(payruns.length > 1){

                if(payruns[1].Response.PayRuns && payruns[1].Response.PayRuns.PayRun.Paystubs && payruns[1].Response.PayRuns.PayRun.Paystubs.Paystub){
                    var tempPaystubs = payruns[1].Response.PayRuns.PayRun.Paystubs.Paystub;
                    for(var i in tempPaystubs){
                        if(tempPaystubs[i].EmployeeID)
                            result[tempPaystubs[i].EmployeeID].PreviousNetPay = tempPaystubs[i].NetPay;
                    }
                }
            }

            return result;
        }
        else{
            return "No Data Returned from Xero API";
        }
    }
};