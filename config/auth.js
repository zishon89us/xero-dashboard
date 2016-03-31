
var fs = require('fs');

module.exports = {

    'xero': {
        'CONSUMER_KEY': 'GHJFS7ARGFDJKJ41YJ3IFUAJSXZCJY',
        'CONSUMER_SECRET': 'YFHATXJNY4JIT2FD8FEVG1MMIRVZ7F',
        'RSA_PRIVATE_KEY': fs.readFileSync(__dirname + '/certs/xero.pem')
    }

};
