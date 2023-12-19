//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema( {
    email : String,
    password : String
});

// Schema change ya ml 
// const secret = process.env.secret;

// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});
app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/register", function(req, res) {
    res.render("register");
});
// app.get("/secrets", function(req, res) {
//     res.render("secrets");
// });
app.post("/register", function (req, res ){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        try {
            newUser.save();
            res.render("secrets");
        } catch (error) {
            console.log(error);
        }
    });

})

app.post("/login",async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = await User.findOne({email: username});
        // console.log("Down here");
        if(user){
            // console.log("Inside user check");
            bcrypt.compare(password, user.password, function(err, result) {
                if(result===true){
                    // console.log("This is inside hash check");
                    res.render("secrets");
                }
                else{
                    res.status(400).json({error: "Password doesn't match!!!"});
                }
            })
            // const result = md5(req.body.password) === user.password;
            // if(result){
            //     res.render("secrets");
            // }else{
            //     res.status(400).json({error: "Password doesn't match!!!"});
            // }
        }else{
            res.status(400).json({error: "User doesn't exist!!!"});
        }
    }catch(err){
        res.status(400).json({error: "Something went wrong!!!"});
    }
    

    

});


app.listen(3000, function() {
    console.log("Server has started on port 3000");
});