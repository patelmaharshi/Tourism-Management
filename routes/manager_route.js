var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var expressValidator = require('express-validator');
router.use(expressValidator())
//main route
router.get("/",function(req,res)
{
    res.render("landing");
});


router.get("/login",function(req, res) 
{
    res.render("adminlogin");    
});


router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/places/manager",
        failureRedirect: "/login",
        failureFlash: "Invalid Credentials"
    }),function(req,res)
    {
        
    });
    


//logout route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/adminlogin");
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()) //checks if user is authenticated or not 
    {
        return next;
    }
    res.redirect("/login");
}

module.exports = router;