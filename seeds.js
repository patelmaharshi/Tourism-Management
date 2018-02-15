var mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    Place = require("./models/place");
    
var data=
[
    {
        name: "Rishikesh", 
        image: "https://farm9.staticflickr.com/8367/8505320133_5fd9937312.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Desert mesa", 
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Cloud's rest", 
        image: "https://farm4.staticflickr.com/3282/2770447094_2c64348643.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB()
{
    //remove all cmapground
    Place.remove({},function(err)
    {
        if (err)
        {
          console.log(err);
        }
        else
        {
          //console.log("removed");
        }
    //   //wait for it to remove and then add the campgrounds
    //   //add some campground
    //   data.forEach(function(camp)
    //   {
    //       Campground.create(camp,function(err,val)
    //       {
    //           if (err)
    //           {
    //               console.log(err);
    //           }
    //           else
    //           {
    //               //console.log("added");
    //               //create a comment for each post
    //               Comment.create(
    //                   {
    //                         text: "This place is great, but I wish there was internet",
    //                         author: "Homer"
    //                   },function(err1,val1)
    //                   {
    //                       if(err1)
    //                       {
    //                           console.log(err1);
    //                       }
    //                       else
    //                       {
    //                           //console.log(val1);
    //                           val.comments.push(val1);
    //                           val.save();
    //                       }
    //                   });
    //           }
    //       });
    //      });
    });
        
    
}
module.exports = seedDB;