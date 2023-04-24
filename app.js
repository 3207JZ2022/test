//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser = require('body-parser');
const app= express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
    email:String,
    password: String
});
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});
const User = mongoose.model("User", userSchema);



app.get("/", (req, res) => {
    res.render('home');
})
app.get("/login", (req, res) => {
    res.render('login');
})

app.get("/register", (req, res) => {
    res.render('register');
})

app.post("/register",(req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
    .then(()=>{
        console.log("save a new user");
        res.render("secrets");
    })
    .catch(err => {console.log(err)});
})

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username})
    .then(function(foundUser){
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }else{
                console.log("Password mismatch");
            }
        }else{
            console.log("User not found");
        }
    })
    .catch(err => console.log("Error: " + err));
});

app.listen("3000",(req,res)=>{
    console.log("listening on port 3000")
})