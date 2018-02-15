var express = require("express");
var router = express.Router({mergeParams: true}); //for sending the id to the cooments
var Place = require("../models/place"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");
    
//new comments
router.get("/comments/new",middleware.isLoggedIn,function(req,res)
{
    Place.findById(req.params.id,function(err,val)
    {
       if (err)
       {
           console.log(err);
       }
       else
       {
               res.render("comments/new",{val: val});
       }
    });
});

//when comments come here 
router.post("/comments",middleware.isLoggedIn,function(req,res)
{
    //lookup for campground
    Place.findById(req.params.id,function(err, val) 
    {
        if(err)
        {
            res.redirect("/places");
        }
        else
        {
            //create a new comment
            Comment.create(req.body.comments,function(err1,val1)
            {
                if(err1)
                {
                    console.log(err1);
                }
                else
                {
                    //add username and id to the comment
                    //save comment
                    val1.author.id = req.user._id;
                    val1.author.username = req.user.username;
                    val1.save();
                    
                    val.comments.push(val1);
                    val.save();
                    req.flash("success","Comment Added");
                    res.redirect("/places/user/" + val._id);
                }
            });
        }
    });
});

//edit
router.get("/comments/:comments_id/edit",middleware.checkCOwner,function(req,res)
{
    Comment.findById(req.params.comments_id,function(err, val) 
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{val_id: req.params.id,comments: val});
        }
    });
});
//comment update
router.put("/comments/:comments_id",middleware.checkCOwner,function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comments_id,req.body.comments,function(err, updval)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/places/user/"+req.params.id);
        }
    });
});

//Delete route 
router.delete("/comments/:comments_id",function(req, res) 
{
    Comment.findByIdAndRemove(req.params.comments_id,function(err,val)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","comment deleted");
            res.redirect("/places/user/"+req.params.id);
        }
    });
});
router.delete("/comments/manager/:comments_id",function(req, res) 
{
    Comment.findByIdAndRemove(req.params.comments_id,function(err,val)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","comment deleted");
            res.redirect("/places/manager/"+req.params.id);
        }
    });
});



//middleware to check ownership

module.exports = router;