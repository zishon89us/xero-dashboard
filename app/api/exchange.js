module.exports = function () {

    var request = require('request'),
        USDtoPKRDefault = 100,
        USDtoPKRPrevious = 100;

    return {

        USDtoPKR: function (req, res) {

            request('https://openexchangerates.org/api/latest.json?app_id=1c5fc79208b94e49ae91ca52b2fea1d7', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(body);
                    if(json.rates && json.rates.PKR)
                        res.send({PKR: json.rates.PKR});
                    else if(USDtoPKRPrevious)
                        res.send({PKR: USDtoPKRPrevious});
                    else
                        res.send({PKR: USDtoPKRDefault});

                } else {
                    res.send({message: "Exchange Rate not Found."});
                }

            });

        }

    }

}



