module.exports = function(models){

    var User = models.user;
    /*var Person = models.person;
    var Thing = models.thing;*/

    return {

        signup: function (req,res)
        {

            var body = req.body;

            User.findOne({ username: body.username
            },function(err, user) {
                if (err)
                    res.send(500, {'message': err});
                // check to see if theres already a user with that email
                if (user) {
                    res.send(403, {'message': 'User already exist!'});
                }else {
                    var newUser = new User({ username: body.username,email: body.email, password:body.password})
                    newUser.save(function (err, user) {
                        if (err){
                            res.send(500, {'message': err});
                        }
                        res.json({ 'message': 'User was successfully registered!', user: user});
                    });
                }
            });
        },

        login:function(req,res)
        {
            if (req.body.remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                req.session.cookie.expires = false; // Cookie expires at end of session
            }
            res.json({ auth_token: req.user.token.auth_token});
        },

        logout: function(req,res)
        {
            req.user.auth_token = null;
            req.user.save(function(err,user){
                if (err){
                    res.send(500, {'message': err});
                }
                res.json({ message: 'See you!'});
            });
        }

    }

}



