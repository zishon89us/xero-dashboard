module.exports = function(connection) {

    var User = require('./user')(connection);
    //var Xero = require('./xero')(connection);

    return {
        user: User
    }
}