
const {compareSync} = require('bcrypt') ; 
const passport = require("passport") ; 
const LocalStrategy = require('passport-local').Strategy ; 

const userModel = require('./database')

passport.use(new LocalStrategy(
    function(username, password, done){
        userModel.findOne({username: username}, function(err, user){
            if(err){
                return done(err) ; // when some error occurs 
             }
             if(!user){ // when username is invalid 
                return done(null, false, {message: 'Incorrect username'}) ; 
             }
             if(!compareSync(password,  user.password)){  // when password is invalid 
                return done(null, false, {message: 'Incorrect password'}) ; 
             }
             return done(null, user) ; // when user is valid 
        });
    }
));

// Persists user data inside session

passport.serializeUser(function(user, done){
    done(null, user.id) ; 
}) ; 

// fetches session details using session id 

passport.deserializeUser(function(id, done){
    userModel.findById(id, function(err, user){
        done(err, user) ; 
    }) ;  
}) ; 

