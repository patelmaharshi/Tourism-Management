var Place = require("../models/place"),
    Comment = require("../models/comment");
    
var middlewareObj={};

middlewareObj.checkOwner = function(req,res,next)
{
    //if user is logged in or not
    if(req.isAuthenticated())
    {
        Place.findById(req.params.id,function(err,val)
        {
            if (err || !val)
            {
                req.flash("error","Place not found");
                res.redirect("back");
            }
            else
            {
                //does the user own the campground
                if(val.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        //use back to redirect back to last page
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCOwner = function(req,res,next)
{
     //if user is logged in or not
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comments_id,function(err,val)
        {
            if (err || !val)
            {
                console.log(err);
            }
            else
            {
                //does the user own the campground
                if(val.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        //use back to redirect back to last page
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    //if no then redirect
}

middlewareObj.isLoggedIn = function (req,res,next)
{
    if(req.isAuthenticated()) //checks if user is authenticated or not 
    {
        return next();
    }
    req.flash("error","You need to be logged in");
    res.redirect("/login");
}

module.exports = middlewareObj;