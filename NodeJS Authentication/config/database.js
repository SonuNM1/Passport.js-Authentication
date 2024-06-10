
const mongoose = require("mongoose") ; 

mongoose.connect('mongodb://127.0.0.1:27017/authentication')

const userSchema = mongoose.Schema({
    username: String, 
    password: String
})

const userModel = mongoose.model('User', userSchema) ; 

module.exports = userModel ; 
