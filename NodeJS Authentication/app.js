
const express = require("express")
const app = express() ;
const userModel = require('./config/database') ; 
const {hashSync} = require('bcrypt') ; 
const session = require("express-session") ; 
const MongoStore = require("connect-mongo") ; 

// middleware

app.use(express.urlencoded({extended:true})) ; 

// set the view engine as ejs 

app.set("view engine", "ejs") ; 

// express session 

app.use(session({
    secret: 'Sonu NM',
    resave: false, 
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/authentication', collectionName: 'sessions'}), 
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

require('./config/passport') ; 

app.use(passport.initialize()) ; 
app.use(passport.session()) ; 

// routes 

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/login', passport.authenticate('local', {successRedirect: 'protected'})) ; 

app.post('/register', (req, res)=>{
    let user = new userModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })
    user.save().then(user => console.log(user) ) ; 
    res.send({success: true})
})

app.get('/logout', (req, res)=>{
    req.logout(); 
    res.redirect('/login')
})

app.get('/protected', (req, res)=>{
    if(req.isAuthenticated()){
        res.send("Protected")
    }else{
        res.send(401).send({msg: "Unauthorized"})
    }
    console.log(req.session)
    console.log(req.body)
    
})

app.listen(5000, (req, res)=>{
    console.log(`Listening on port 5000`)
})