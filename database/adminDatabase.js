var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
//mongoose.connect('"mongodb://localhost:27017/unovoyage');
var db = mongoose.connection;
var url = "mongodb://localhost:27017/unovoyage";
var User = require('../models/user');
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
    

    mongoose.connection.db.listCollections({name: 'users'})
    .next(function(err, collinfo) {
        if (collinfo) {
           console.log("admins exists");
        }
        else
        {

            User.register(new User({username: "admin"}), "admin", function(err,user)
            {
                if(err)
                {
                   console.log(err);
                }
                //if no error then authenticate the user 
               db.collection("users").update({username:"admin"},{$set:{isAdmin:true}});
            });

            User.register(new User({username: "manager"}), "manager", function(err,user)
            {
                if(err)
                {
                   console.log(err);
                }
                //if no error then authenticate the user 
               db.collection("users").update({username:"manager"},{$set:{isManager:true}});
            });


        }
    });

});


