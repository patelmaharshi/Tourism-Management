var express = require("express");
var router = express.Router();
var passport = require("passport");
var Admin = require("../models/admin");
var User = require("../models/user");
var LocalStrategy = require('passport-local').Strategy;
var status=0;
var updationstatus=0;
router.use(function(req,res,next)
{
    // whatever we put in res.locals is available in our templates 
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //required next
});

//show login form
router.get("/adminlogin",function(req, res) 
{
    res.render("adminlogin",{updationstatus:updationstatus,status:status});  
    status=0; 
    updationstatus=0;
});
//use middleware
router.post("/adminlogin",passport.authenticate("local",
    {
        successRedirect: "/checkAdmin",
        failureRedirect: "/loginFailed",
        failureFlash: "Invalid Credentials"
    }),function(req,res)
    {
        
    });

router.get("/loginFailed",function(req, res) 
{
    status=1;
    res.redirect("/adminlogin");    
});

router.get("/checkAdmin",function(req, res) {

     User.findOne({username:req.user.username}).exec(function(err,user)
    {
        if(err)
        {
            console.log(err);
        }
        else if(user.isAdmin==false && user.isManager==false)
        {
            console.log("not admin" );
            res.redirect("/places/user");
            failureFlash: "Invalid Credentials"
           // res.redirect("/adminlogin");
        }
        else if (user.isManager==true) 
        {
            console.log(" I am the Manager");
            res.redirect("/places/manager");
            failureFlash: "Invalid Credentials"

        }
        else
        {
            console.log("~~~~~~~~admin~~~~~~~~" + user.isAdmin + " " + user.username);
            res.redirect("/places");
        }
    });
   

});


//logout route
router.get("/logout",function(req, res) {
    req.logout();
    var msg= req.flash("success","logged you out");
    res.redirect("/adminlogin");
   /* res.render("adminlogin",{updationstatus:updationstatus,status:status,});  
     status=0; 
    updationstatus=0;*/
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()) //checks if user is authenticated or not 
    {
        return next;
    }
    res.redirect("/adminlogin");
}

module.exports = router;