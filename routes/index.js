var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//main route
var status=0;
var registrationstatus=0;
var updationstatus=0;
router.get("/",function(req,res)
{
    res.render("landing");
});

//Auth routes
//show register
router.get("/register",function(req, res) 
{
    res.render("register",{registrationstatus:registrationstatus});
    registrationstatus=0;
});

router.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var contact = req.body.contact;
    //var password2 = req.body.password2;

  
    var emailCheck=ValidateEmail(email);
    var contactCheck=contact.length;

  

    if(!emailCheck ){
        registrationstatus=1;
        console.log("unsuccesful registration incorrect email ");
        res.redirect('/register');
        
    }
    else if(contactCheck!=10)
    {
        registrationstatus=3;
        console.log("unsuccesful registration invalid contact " );
        res.redirect('/register');
    } else {
       
        User.count({username:req.body.username}, function (err, count){ 
            if(count>0){
        
                        console.log("username exists from count");
                        registrationstatus=2;
                        res.redirect('/register');
              }
              else{
                     User.register(new User({username: req.body.username,email: email,name: name,contact: contact}), req.body.password, function(err,user)
                    {
                        if(err )
                        {
                            console.log(err);
                            console.log("registration failed" + result);
                            registrationstatus=1;
                            res.redirect('/register');
                        }
                       
                             passport.authenticate("local")(req,res,function()
                            {
                               // req.flash("success","Welcome to UNOVOYAGE "+user.username);
                                res.redirect("/places/user");
                            });
                               
                    });

              }
        }); 


    }

});


    function ValidateEmail(mail)   
    {  
     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
      {  
        return (true)  
      }  
        //alert("You have entered an invalid email address!")  
        return (false)  
    }  


//show login form
router.get("/login",function(req, res) 
{
    res.render("login");    
});

//use middleware
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/places/user",
        failureRedirect: "/login",
        failureFlash: "Invalid Credentials"
    }),function(req,res)
    {
        
    });
    
router.get('/edit', function(req, res){
    
    
    res.render('editCredentials',{error:false,message: 'valid',updationstatus:updationstatus});
    updationstatus=0;
});

router.put('/edit', function(req, res){
    var email = req.body.email;
    var name = req.body.name;
    var contact = req.body.contact;
   
    // Validation
    

    var emailCheck=ValidateEmail(email);
    var contactCheck=contact.length;

  

    if(!emailCheck )
    {
        updationstatus=1;
        console.log("unsuccesful registration incorrect email ");
        res.redirect('/edit');
        
    }
    else if(contactCheck!=10)
    {
        updationstatus=2;
        console.log("unsuccesful registration invalid contact " );
        res.redirect('/edit');
    } else {
       
                 User.findById(req.user._id,function(err,val)
                {
                    if(err)
                    {
                        res.redirect("/");
                    }
                    else
                    {
                        val.email = email;
                        val.name = name;
                        val.contact = contact;
                        val.save();
                        updationstatus=3;
                        res.redirect("/logout");
                    }
                });
                   
           }
        
   

});





//logout route
/*router.get("/adminlogout",function(req, res) {
    req.logout();
    req.flash("success","logged you out");
    console.log(" updationstatus  === ======== " + updationstatus + " status========= " + status );

    res.render("adminlogin",{updationstatus:updationstatus,status:status});
    updationstatus=0;
});*/

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()) //checks if user is authenticated or not 
    {
        return next;
    }
    res.redirect("/login");
}

module.exports = router;