//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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
const secret = process.env.secret;

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    try {
        newUser.save();
        res.render("secrets");
    } catch (error) {
        console.log(error);
    }
})

app.post("/login",async function(req, res){
    const username = req.body.username;
    const passwordH = req.body.password;

    try{
        const user =await User.findOne({email: username});
        if(user){
            const result = req.body.password === user.password;
            if(result){
                res.render("secrets");
            }else{
                res.status(400).json({error: "Password doesn't match!!!"});
            }
        }else{
            res.status(400).json({error: "User doesn't exist!!!"});
        }
    }catch(err){
        res.status(400).json({error});
    }
    

    

});


app.listen(3000, function() {
    console.log("Server has started on port 3000");
});